import express from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/adminMiddleware.js";
import { AdminRecord } from "../models/AdminRecord.js";
import { Product } from "../models/Product.js";
import { User } from "../models/userSchema.js";
import { confirmBankTransferPayment, initializePaystackTransaction, isValidPaystackSignature, generateReceiptNumber, markOrderPaid, releaseInventory, reserveInventory, verifyPaystackTransaction } from "../services/paystack.js";

import {
    sendOrderConfirmationEmail,
    sendOrderNotificationEmail,
} from "../config/email.js";
const router = express.Router();
const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

const ownedOrder = (id, userId) => ({
    _id: id,
    resource: "order",
    createdBy: userId,
});

const presentOrder = (record) => ({
    ...record.payload,
    id: record._id.toString(),
});

const sendOrderEmails = async (order) => {
    const results = await Promise.allSettled([
        sendOrderConfirmationEmail(order),
        sendOrderNotificationEmail(order),
    ]);
    for (const result of results) {
        if (result.status === "rejected") {
            console.error("Order email could not be sent:", result.reason.message);
        }
    }
};

const getCartData = async (user) => {
    const cart = [];
    for (const entry of user.cart ?? []) {
        const product = await Product.findOne({ _id: entry.product, status: "Active" }).lean();
        if (product) cart.push({ product, quantity: entry.quantity });
    }
    const subtotal = cart.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    return { cart, subtotal };
};

const getCheckout = async (user) => {
    const { cart, subtotal } = await getCartData(user);
    const unavailable = cart.some(({ product, quantity }) => quantity > product.stock);
    if (unavailable) {
        const error = new Error("One or more cart quantities exceed available stock");
        error.statusCode = 409;
        throw error;
    }
    if (process.env.DELIVERY_FEE === undefined) {
        const error = new Error("Delivery pricing is not configured");
        error.statusCode = 503;
        throw error;
    }
    const deliveryFee = Number(process.env.DELIVERY_FEE);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
        throw new Error("DELIVERY_FEE must be a non-negative number");
    }
    return {
        items: cart.map(({ product, quantity }) => ({
            product: product._id.toString(),
            name: product.name,
            price: product.price,
            quantity,
        })),
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
    };
};

const getCheckoutFromItems = async (items) => {
    if (!Array.isArray(items) || !items.length || items.length > 100) {
        const error = new Error("Your cart is empty or invalid"); error.statusCode = 400; throw error;
    }
    const cart = [];
    const seenProductIds = new Set();
    for (const item of items) {
        const productId = item?.productId || item?.id;
        const quantity = Number(item?.quantity);
        if (!mongoose.isValidObjectId(productId) || seenProductIds.has(String(productId)) || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
            const error = new Error("Invalid product or quantity in checkout"); error.statusCode = 400; throw error;
        }
        seenProductIds.add(String(productId));
        const product = await Product.findOne({ _id: productId, status: "Active" }).lean();
        if (!product || quantity > product.stock) {
            const error = new Error(`${product?.name || "A product"} is unavailable in the requested quantity`); error.statusCode = 409; throw error;
        }
        cart.push({ product, quantity });
    }
    if (process.env.DELIVERY_FEE === undefined) {
        const error = new Error("Delivery pricing is not configured"); error.statusCode = 503; throw error;
    }
    const deliveryFee = Number(process.env.DELIVERY_FEE);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) throw new Error("DELIVERY_FEE must be a non-negative number");
    const subtotal = cart.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    return { items: cart.map(({ product, quantity }) => ({ product: product._id.toString(), name: product.name, price: product.price, quantity })), subtotal, deliveryFee, total: subtotal + deliveryFee };
};

const createReservedOrder = async (user, checkout, payload) => {
    if (!(await reserveInventory(checkout.items))) {
        const error = new Error("Some items are no longer available in the requested quantity");
        error.statusCode = 409;
        throw error;
    }
    try {
        return await AdminRecord.create({
            resource: "order",
            createdBy: user._id,
            payload: {
                ...payload,
                items: checkout.items,
                inventoryReserved: true,
                reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
        });
    } catch (error) {
        await releaseInventory(checkout.items);
        throw error;
    }
};

const updateCartItem = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productId)) {
        return res.status(400).json({ status: "failed", message: "Invalid product id" });
    }
    const quantity = req.body?.quantity;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
        return res.status(400).json({ status: "failed", message: "Quantity must be between 1 and 1000" });
    }
    const product = await Product.findOne({ _id: req.params.productId, status: "Active" });
    if (!product) return res.status(404).json({ status: "failed", message: "Product not found" });
    const user = await User.findById(req.user._id);
    const item = user.cart.find((entry) => entry.product.toString() === req.params.productId);
    if (item) item.quantity = quantity;
    else user.cart.push({ product: product._id, quantity });
    await user.save();
    return res.status(200).json({ status: "success", data: (await getCartData(user)).cart });
};

router.get("/cart", auth, async (req, res) => {
    const { cart } = await getCartData(req.user);
    return res.status(200).json({ status: "success", data: cart });
});
router.get("/cart/summary", auth, async (req, res) => {
    const { cart, subtotal } = await getCartData(req.user);
    return res.status(200).json({
        status: "success",
        data: { items: cart.length, subtotal },
    });
});
router.post("/cart", auth, updateCartItem);
router.put("/cart/:productId", auth, updateCartItem);
router.delete("/cart/:productId", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productId)) {
        return res.status(400).json({ status: "failed", message: "Invalid product id" });
    }
    await User.updateOne({ _id: req.user._id }, { $pull: { cart: { product: req.params.productId } } });
    return res.status(200).json({ status: "success", message: "Cart item removed" });
});
router.delete("/cart", auth, async (req, res) => {
    await User.updateOne({ _id: req.user._id }, { $set: { cart: [] } });
    return res.status(200).json({ status: "success", message: "Cart cleared" });
});

router.post("/checkout/calculate", auth, checkoutLimiter, async (req, res) => {
    const checkout = Array.isArray(req.body?.items)
        ? await getCheckoutFromItems(req.body.items)
        : await getCheckout(req.user);
    return res.status(200).json({ status: "success", data: checkout });
});
router.get("/checkout/summary", auth, async (req, res) => {
    const checkout = await getCheckout(req.user);
    return res.status(200).json({ status: "success", data: checkout });
});
router.post("/checkout/delivery-fee", auth, checkoutLimiter, async (req, res) => {
    if (process.env.DELIVERY_FEE === undefined) {
        return res.status(503).json({ status: "failed", message: "Delivery pricing is not configured" });
    }
    const deliveryFee = Number(process.env.DELIVERY_FEE);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
        return res.status(503).json({ status: "failed", message: "Delivery pricing is not configured" });
    }
    return res.status(200).json({ status: "success", data: { deliveryFee } });
});
router.post("/checkout/order", auth, checkoutLimiter, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ status: "failed", message: "Please sign in to check out" });
    const checkout = await getCheckoutFromItems(req.body?.items);
    const details = req.body?.customer ?? {};
    const customerName = [details.firstName, details.lastName].filter((value) => typeof value === "string").join(" ").trim() || user.userName;
    const email = typeof details.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email) ? details.email : user.email;
    if (![details.address, details.city, details.state, details.phone].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({ status: "failed", message: "Enter valid delivery contact details and address" });
    }
    const order = await createReservedOrder(user, checkout, {
            customer: { name: customerName, email, phone: details.phone || "" },
            email,
            deliveryAddress: { address: details.address || "", city: details.city || "", state: details.state || "" },
            notes: typeof details.notes === "string" ? details.notes.slice(0, 1000) : "",
            orderNumber: `NA-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
            subtotal: checkout.subtotal,
            total: checkout.total,
            deliveryFee: checkout.deliveryFee,
            payment: "Pending",
            paymentStatus: "Pending",
            status: "Pending",
            date: new Date().toISOString(),
    });
    await sendOrderEmails(order.payload);
    return res.status(201).json({ status: "success", data: presentOrder(order) });
});

router.get("/orders/my-orders", auth, async (req, res) => {
    const orders = await AdminRecord.find({ resource: "order", createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: orders.map(presentOrder) });
});
router.get("/orders/my-orders/:id", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne(ownedOrder(req.params.id, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    return res.status(200).json({ status: "success", data: presentOrder(order) });
});
router.post("/orders", auth, checkoutLimiter, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user?.cart.length) {
        return res.status(400).json({ status: "failed", message: "Your cart is empty" });
    }
    const checkout = await getCheckout(user);
    if (checkout.items.length !== user.cart.length) {
        return res.status(409).json({ status: "failed", message: "One or more cart products are unavailable" });
    }
    const order = await createReservedOrder(user, checkout, {
            customer: user.userName,
            email: user.email,
            total: checkout.total,
            deliveryFee: checkout.deliveryFee,
            payment: "Pending",
            paymentStatus: "Pending",
            status: "Pending",
            date: new Date().toISOString(),
    });
    await sendOrderEmails(order.payload);
    return res.status(201).json({ status: "success", data: presentOrder(order) });
});
router.post("/orders/:id/cancel", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne(ownedOrder(req.params.id, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.status !== "Pending" || order.payload.paymentStatus === "Paid" || order.payload.paymentReference) {
        return res.status(409).json({ status: "failed", message: "Only pending orders can be cancelled" });
    }
    const cancelled = await AdminRecord.findOneAndUpdate(
        { _id: order._id, resource: "order", "payload.status": "Pending", "payload.paymentStatus": { $ne: "Paid" }, "payload.paymentReference": { $exists: false } },
        { $set: { "payload.status": "Cancelled", "payload.inventoryReserved": false } },
        { returnDocument: 'after' }
    );
    if (!cancelled) return res.status(409).json({ status: "failed", message: "This order can no longer be cancelled" });
    if (order.payload.inventoryReserved) await releaseInventory(order.payload.items);
    order.payload = cancelled.payload;
    return res.status(200).json({ status: "success", data: presentOrder(order) });
});
router.get("/orders/:id/track", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne(ownedOrder(req.params.id, req.user._id)).select("payload.status payload.date");
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    return res.status(200).json({ status: "success", data: { id: order._id.toString(), ...order.payload } });
});
router.get("/orders", auth, admin, async (_req, res) => {
    const orders = await AdminRecord.find({ resource: "order" }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: orders.map(presentOrder) });
});
router.get("/orders/:id", auth, admin, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne({ _id: req.params.id, resource: "order" });
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    return res.status(200).json({ status: "success", data: presentOrder(order) });
});
router.post("/orders/:id/status", auth, admin, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id) ||
        !["Pending", "Processing", "Delivered", "Cancelled"].includes(req.body?.status)) {
        return res.status(400).json({ status: "failed", message: "Invalid order status" });
    }
    const current = await AdminRecord.findOne({ _id: req.params.id, resource: "order" });
    if (!current) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (req.body.status === "Cancelled" && current.payload.paymentStatus === "Paid") {
        return res.status(409).json({ status: "failed", message: "Paid orders require a refund before cancellation" });
    }
    const order = await AdminRecord.findOneAndUpdate(
        { _id: req.params.id, resource: "order", ...(req.body.status === "Cancelled" && { "payload.paymentStatus": { $ne: "Paid" } }) },
        { $set: { "payload.status": req.body.status, ...(req.body.status === "Cancelled" && { "payload.inventoryReserved": false }) } },
        { returnDocument: 'after' }
    );
    if (!order) return res.status(409).json({ status: "failed", message: "Order could not be updated" });
    if (req.body.status === "Cancelled" && current.payload.inventoryReserved) await releaseInventory(current.payload.items);
    return res.status(200).json({ status: "success", data: presentOrder(order) });
});

router.get("/customers/profile", auth, async (req, res) =>
    res.status(200).json({ status: "success", data: req.user })
);
router.put("/customers/profile", auth, async (req, res) => {
    const { userName, image, phone } = req.body ?? {};
    if ((userName !== undefined && (typeof userName !== "string" || userName.length > 100)) ||
        (image !== undefined && (typeof image !== "string" || image.length > 2048)) ||
        (phone !== undefined && (typeof phone !== "string" || phone.length > 32))) {
        return res.status(400).json({ status: "failed", message: "Invalid profile data" });
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { ...(userName !== undefined && { userName }), ...(image !== undefined && { image }), ...(phone !== undefined && { phone }) } },
        { returnDocument: 'after', runValidators: true }
    ).select("-password -verificationToken -passwordResetToken -passwordResetExpires");
    return res.status(200).json({ status: "success", data: user });
});
router.get("/customers/orders", auth, async (req, res) => {
    const orders = await AdminRecord.find({ resource: "order", createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: orders.map(presentOrder) });
});
router.get("/customers/orders/:orderId", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne(ownedOrder(req.params.orderId, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    return res.status(200).json({ status: "success", data: presentOrder(order) });
});
router.get("/customers/addresses", auth, async (req, res) =>
    res.status(200).json({ status: "success", data: req.user.addresses ?? [] })
);
router.put("/customers/addresses", auth, async (req, res) => {
    const { label, address, city, state, postalCode, country } = req.body ?? {};
    const values = { label, address, city, state, postalCode, country };
    if (typeof address !== "string" || !address.trim() ||
        Object.values(values).some((value) => value !== undefined && (typeof value !== "string" || value.length > 500))) {
        return res.status(400).json({ status: "failed", message: "A valid delivery address is required" });
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { addresses: values } },
        { returnDocument: 'after', runValidators: true }
    );
    return res.status(200).json({ status: "success", data: user.addresses });
});
router.delete("/customers/addresses/:addressId", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.addressId)) {
        return res.status(400).json({ status: "failed", message: "Invalid address id" });
    }
    await User.updateOne({ _id: req.user._id }, { $pull: { addresses: { _id: req.params.addressId } } });
    return res.status(200).json({ status: "success", message: "Address deleted" });
});
router.delete("/customers/account", auth, async (req, res) => {
    await User.deleteOne({ _id: req.user._id, role: "user" });
    res.clearCookie("accessToken", { path: "/api/v1", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    res.clearCookie("refreshToken", { path: "/api/v1", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    return res.status(200).json({ status: "success", message: "Account deleted" });
});

const getBankDetails = () => ({
    accountName: process.env.BANK_ACCOUNT_NAME || "Niceman Agro & Farms",
    bankName: process.env.BANK_NAME || "Access Bank",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "1234567890",
});

router.post("/payments/bank-transfer/reference", auth, checkoutLimiter, async (req, res) => {
    const orderId = req.body?.orderId;
    if (!mongoose.isValidObjectId(orderId)) return res.status(400).json({ status: "failed", message: "Invalid order" });
    const order = await AdminRecord.findOne(ownedOrder(orderId, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.paymentStatus === "Paid" || order.payload.status === "Cancelled" || !order.payload.inventoryReserved) {
        return res.status(409).json({ status: "failed", message: "This order is no longer available for payment" });
    }
    let paymentReference = order.payload.paymentReference;
    if (!paymentReference) {
        paymentReference = `BT-${crypto.randomUUID()}`;
        await AdminRecord.updateOne(
            { _id: order._id, resource: "order", "payload.status": "Pending", "payload.paymentStatus": "Pending", "payload.inventoryReserved": true, "payload.paymentReference": { $exists: false } },
            { $set: { "payload.paymentReference": paymentReference, "payload.paymentMethod": "Bank Transfer" } }
        );
    }
    const bankDetails = getBankDetails();
    return res.status(200).json({
        status: "success",
        data: {
            orderId: order.id,
            orderNumber: order.payload.orderNumber,
            paymentReference,
            total: order.payload.total,
            deliveryFee: order.payload.deliveryFee,
            bankDetails,
            customerName: order.payload.customer?.name || order.payload.customer,
            customerEmail: order.payload.email,
        },
    });
});

router.get("/payments/bank-transfer/details", auth, async (_req, res) => {
    const bankDetails = getBankDetails();
    return res.status(200).json({ status: "success", data: bankDetails });
});

router.post("/orders/:id/confirm-payment", auth, admin, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const { transactionReference } = req.body ?? {};
    const order = await AdminRecord.findOne({ _id: req.params.id, resource: "order" });
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.paymentStatus === "Paid") {
        return res.status(409).json({ status: "failed", message: "This order is already marked as paid" });
    }
    if (order.payload.status === "Cancelled") {
        return res.status(409).json({ status: "failed", message: "Cancelled orders cannot be paid" });
    }
    const confirmedOrder = await confirmBankTransferPayment(order, transactionReference, req.user._id);
    if (!confirmedOrder) return res.status(500).json({ status: "failed", message: "Unable to confirm payment" });
    return res.status(200).json({ status: "success", data: presentOrder(confirmedOrder) });
});

router.get("/orders/:id/receipt", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne(ownedOrder(req.params.id, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.paymentStatus !== "Paid") {
        return res.status(409).json({ status: "failed", message: "Receipt is only available after payment is confirmed" });
    }
    return res.status(200).json({ status: "success", data: presentOrder(order) });
});

router.post("/payments/initialize", auth, checkoutLimiter, async (req, res) => {
    const orderId = req.body?.orderId;
    if (!mongoose.isValidObjectId(orderId)) return res.status(400).json({ status: "failed", message: "Invalid order" });
    const order = await AdminRecord.findOne(ownedOrder(orderId, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.paymentStatus === "Paid" || order.payload.status === "Cancelled" || !order.payload.inventoryReserved) {
        return res.status(409).json({ status: "failed", message: "This order is no longer available for payment" });
    }
    if (!process.env.CLIENT_URL) return res.status(503).json({ status: "failed", message: "Client URL is not configured" });
    const reference = `NA-${crypto.randomUUID()}`;
    const callbackState = jwt.sign(
        { purpose: "paystack-callback", orderId: order.id, reference },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
    const claimedOrder = await AdminRecord.findOneAndUpdate(
        { _id: order._id, resource: "order", "payload.status": "Pending", "payload.paymentStatus": { $ne: "Paid" }, "payload.inventoryReserved": true, "payload.paymentReference": { $exists: false } },
        { $set: {
            "payload.paymentReference": reference,
            "payload.paymentMethod": "Paystack",
            "payload.reservationExpiresAt": new Date(Date.now() + 24 * 60 * 60 * 1000),
        } },
        { returnDocument: 'after' }
    );
    if (!claimedOrder) return res.status(409).json({ status: "failed", message: "This order is no longer available for payment" });
    let transaction;
    try {
        transaction = await initializePaystackTransaction(
            claimedOrder.payload.email,
            Math.round(Number(claimedOrder.payload.total) * 100),
            reference,
            `${process.env.CLIENT_URL.replace(/\/$/, "")}/payment/success?state=${encodeURIComponent(callbackState)}`,
            { order_id: claimedOrder.id, user_id: req.user._id.toString() }
        );
    } catch (error) {
        await AdminRecord.updateOne(
            { _id: claimedOrder._id, "payload.paymentReference": reference, "payload.paymentStatus": { $ne: "Paid" } },
            { $unset: { "payload.paymentReference": "", "payload.paymentMethod": "" } }
        );
        throw error;
    }
    return res.status(200).json({ status: "success", data: { authorizationUrl: transaction.authorization_url, reference } });
});

router.get("/payments/verify/:reference", async (req, res) => {
    if (typeof req.params.reference !== "string" || req.params.reference.length > 100) return res.status(400).json({ status: "failed", message: "Invalid payment reference" });
    let callback;
    try {
        callback = jwt.verify(req.query.state, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ status: "failed", message: "Invalid or expired payment confirmation" });
    }
    if (callback.purpose !== "paystack-callback" || callback.reference !== req.params.reference || !mongoose.isValidObjectId(callback.orderId)) {
        return res.status(401).json({ status: "failed", message: "Invalid payment confirmation" });
    }
    const order = await AdminRecord.findOne({ _id: callback.orderId, resource: "order", "payload.paymentReference": req.params.reference });
    if (!order) return res.status(404).json({ status: "failed", message: "Payment not found" });
    const transaction = await verifyPaystackTransaction(req.params.reference);
    const paidOrder = await markOrderPaid(transaction);
    if (!paidOrder || paidOrder.id !== callback.orderId) {
        return res.status(402).json({ status: "failed", message: "Payment has not been confirmed" });
    }
    return res.status(200).json({ status: "success", data: presentOrder(paidOrder) });
});

router.post("/payments/webhook", async (req, res) => {
    if (!isValidPaystackSignature(req.rawBody, req.get("x-paystack-signature"))) {
        return res.status(401).json({ status: "failed", message: "Invalid webhook signature" });
    }
    const event = req.body;
    if (event?.event !== "charge.success" || !event?.data?.reference) return res.sendStatus(200);
    const transaction = await verifyPaystackTransaction(event.data.reference);
    await markOrderPaid(transaction);
    return res.sendStatus(200);
});
router.get("/payments/:paymentId", auth, async (_req, res) => res.status(501).json({ status: "failed", message: "Payment lookup is not supported" }));
router.post("/payments/:paymentId/cancel", auth, async (_req, res) => res.status(501).json({ status: "failed", message: "Payment cancellation is not supported" }));
router.post("/payments/cancel", auth, async (_req, res) => res.status(501).json({ status: "failed", message: "Payment cancellation is not supported" }));
router.get("/payments/my-payments", auth, async (_req, res) => res.status(501).json({ status: "failed", message: "Payment history is not supported" }));
router.get("/payments", auth, admin, async (_req, res) => res.status(501).json({ status: "failed", message: "Payment listing is not supported" }));

export default router;
