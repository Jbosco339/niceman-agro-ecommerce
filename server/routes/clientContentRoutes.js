import express from "express";
import mongoose from "mongoose";
import auth from "../middlewares/auth.js";
import { AdminRecord } from "../models/AdminRecord.js";
import { validateAdminPayload } from "../controllers/adminResourceController.js";

const router = express.Router();

router.get("/categories", async (_req, res) => {
    const records = await AdminRecord.find({
        resource: "category",
        "payload.status": { $ne: "Inactive" },
    }).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        data: records.map((record) => ({ ...record.payload, id: record._id.toString() })),
    });
});

router.get("/categories/slug/:slug", async (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const records = await AdminRecord.find({ resource: "category", "payload.status": { $ne: "Inactive" } });
    const record = records.find((item) =>
        item.payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug
    );
    if (!record) return res.status(404).json({ status: "failed", message: "Category not found" });
    return res.status(200).json({ status: "success", data: { ...record.payload, id: record._id.toString() } });
});

router.get("/categories/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid category id" });
    }
    const record = await AdminRecord.findOne({
        _id: req.params.id,
        resource: "category",
        "payload.status": { $ne: "Inactive" },
    });
    if (!record) return res.status(404).json({ status: "failed", message: "Category not found" });
    return res.status(200).json({ status: "success", data: { ...record.payload, id: record._id.toString() } });
});

router.get("/blog", async (req, res) => {
    const query = { resource: "article", "payload.status": "Published" };
    if (typeof req.query.category === "string" && req.query.category.length <= 80) {
        query["payload.category"] = req.query.category;
    }
    const posts = await AdminRecord.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        data: posts.map((post) => ({ ...post.payload, id: post._id.toString() })),
    });
});

router.get("/blog/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid article id" });
    }
    const post = await AdminRecord.findOne({
        _id: req.params.id,
        resource: "article",
        "payload.status": "Published",
    });
    if (!post) return res.status(404).json({ status: "failed", message: "Article not found" });
    return res.status(200).json({ status: "success", data: { ...post.payload, id: post._id.toString() } });
});

router.get("/reviews/product/:productId", async (req, res) => {
    const reviews = await AdminRecord.find({
        resource: "review",
        "payload.product": req.params.productId,
        "payload.status": "Approved",
    }).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        data: reviews.map((review) => ({ ...review.payload, id: review._id.toString() })),
    });
});

router.get("/reviews/my-reviews", auth, async (req, res) => {
    const reviews = await AdminRecord.find({ resource: "review", createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        data: reviews.map((review) => ({ ...review.payload, id: review._id.toString() })),
    });
});

router.post("/reviews", auth, async (req, res) => {
    const payload = validateAdminPayload("review", req.body);
    if (!payload || typeof payload.product !== "string" ||
        !mongoose.isValidObjectId(payload.product) ||
        typeof payload.comment !== "string" || !payload.comment.trim() ||
        !Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
        return res.status(400).json({ status: "failed", message: "Review requires a product and a rating from 1 to 5" });
    }
    const product = await mongoose.model("Product").findOne({ _id: payload.product, status: "Active" }).select("_id");
    if (!product) return res.status(404).json({ status: "failed", message: "Product not found" });
    const review = await AdminRecord.create({
        resource: "review",
        createdBy: req.user._id,
        payload: {
            ...payload,
            customer: req.user.userName,
            email: req.user.email,
            status: "Pending",
            date: new Date().toISOString(),
        },
    });
    return res.status(201).json({ status: "success", data: { ...review.payload, id: review._id.toString() } });
});

router.get("/reviews/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid review id" });
    }
    const review = await AdminRecord.findOne({
        _id: req.params.id,
        resource: "review",
        "payload.status": "Approved",
    });
    if (!review) return res.status(404).json({ status: "failed", message: "Review not found" });
    return res.status(200).json({ status: "success", data: { ...review.payload, id: review._id.toString() } });
});

router.put("/reviews/:id", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid review id" });
    }
    const payload = validateAdminPayload("review", req.body);
    if (!payload || payload.status !== undefined || payload.email !== undefined || payload.customer !== undefined ||
        (payload.product !== undefined && (typeof payload.product !== "string" || !mongoose.isValidObjectId(payload.product))) ||
        (payload.comment !== undefined && (typeof payload.comment !== "string" || !payload.comment.trim())) ||
        (payload.rating !== undefined && (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5))) {
        return res.status(400).json({ status: "failed", message: "Invalid review data" });
    }
    const review = await AdminRecord.findOne({ _id: req.params.id, resource: "review", createdBy: req.user._id });
    if (!review) return res.status(404).json({ status: "failed", message: "Review not found" });
    review.payload = { ...review.payload, ...payload, status: "Pending" };
    await review.save();
    return res.status(200).json({ status: "success", data: { ...review.payload, id: review._id.toString() } });
});

router.delete("/reviews/:id", auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid review id" });
    }
    const review = await AdminRecord.findOneAndDelete({
        _id: req.params.id,
        resource: "review",
        createdBy: req.user._id,
    });
    if (!review) return res.status(404).json({ status: "failed", message: "Review not found" });
    return res.status(200).json({ status: "success", message: "Review deleted" });
});

export default router;
