import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/adminMiddleware.js";
import { AdminRecord } from "../models/AdminRecord.js";
import { Product } from "../models/Product.js";
import { User } from "../models/userSchema.js";

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
    const checkout = await getCheckout(req.user);
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

const paymentUnavailable = (_req, res) =>
    res.status(503).json({ status: "failed", message: "Online payments are unavailable until a payment provider is configured" });
router.post("/payments/initialize", auth, paymentUnavailable);
router.get("/payments/verify/:reference", auth, paymentUnavailable);
router.get("/payments/:paymentId", auth, paymentUnavailable);
router.post("/payments/:paymentId/cancel", auth, paymentUnavailable);
router.post("/payments/cancel", auth, paymentUnavailable);
router.get("/payments/my-payments", auth, paymentUnavailable);
router.get("/payments", auth, admin, paymentUnavailable);

export default router;
