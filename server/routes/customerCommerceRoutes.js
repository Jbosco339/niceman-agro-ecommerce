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
import { initializePaystackTransaction, isValidPaystackSignature, markOrderPaid, verifyPaystackTransaction } from "../services/paystack.js";

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
    const order = await AdminRecord.create({
        resource: "order",
        createdBy: user._id,
        payload: {
            customer: { name: customerName, email, phone: details.phone || "" },
            email,
            deliveryAddress: { address: details.address || "", city: details.city || "", state: details.state || "" },
            notes: typeof details.notes === "string" ? details.notes.slice(0, 1000) : "",
            orderNumber: `NA-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
            items: checkout.items.map(({ name, price, quantity }) => ({ name, price, quantity })),
            subtotal: checkout.subtotal,
            total: checkout.total,
            deliveryFee: checkout.deliveryFee,
            payment: "Pending",
            paymentStatus: "Pending",
            status: "Pending",
            date: new Date().toISOString(),
        },
    });
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
    const order = await AdminRecord.create({
        resource: "order",
        createdBy: user._id,
        payload: {
            customer: user.userName,
            email: user.email,
            items: checkout.items.map(({ name, price, quantity }) => ({ name, price, quantity })),
            total: checkout.total,
            deliveryFee: checkout.deliveryFee,
            payment: "Pending",
            paymentStatus: "Pending",
            status: "Pending",
            date: new Date().toISOString(),
        },
    });
    return res.status(201).json({ status: "success", data: presentOrder(order) });
});
router.post("/orders/:id/cancel", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid order id" });
    }
    const order = await AdminRecord.findOne(ownedOrder(req.params.id, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.status !== "Pending") {
        return res.status(409).json({ status: "failed", message: "Only pending orders can be cancelled" });
    }
    order.payload = { ...order.payload, status: "Cancelled" };
    await order.save();
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
    const order = await AdminRecord.findOneAndUpdate(
        { _id: req.params.id, resource: "order" },
        { $set: { "payload.status": req.body.status } },
        { new: true }
    );
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
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
        { new: true, runValidators: true }
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
        { new: true, runValidators: true }
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

router.post("/payments/initialize", auth, checkoutLimiter, async (req, res) => {
    const orderId = req.body?.orderId;
    if (!mongoose.isValidObjectId(orderId)) return res.status(400).json({ status: "failed", message: "Invalid order" });
    const order = await AdminRecord.findOne(ownedOrder(orderId, req.user._id));
    if (!order) return res.status(404).json({ status: "failed", message: "Order not found" });
    if (order.payload.paymentStatus === "Paid") return res.status(409).json({ status: "failed", message: "This order has already been paid" });
    if (!process.env.CLIENT_URL) return res.status(503).json({ status: "failed", message: "Client URL is not configured" });
    const reference = `NA-${crypto.randomUUID()}`;
    const callbackState = jwt.sign(
        { purpose: "paystack-callback", orderId: order.id, reference },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
    order.payload = { ...order.payload, paymentReference: reference, paymentMethod: "Paystack" };
    await order.save();
    const transaction = await initializePaystackTransaction(
        order.payload.email,
        Math.round(Number(order.payload.total) * 100),
        reference,
        `${process.env.CLIENT_URL.replace(/\/$/, "")}/payment/success?state=${encodeURIComponent(callbackState)}`,
        { order_id: order.id, user_id: req.user._id.toString() }
    );
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
