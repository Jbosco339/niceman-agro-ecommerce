import mongoose from "mongoose";
import { Product } from "../models/Product.js";

const editableFields = ["name", "category", "price", "stock", "description", "image", "status"];

const productPayload = (body, partial = false) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    const payload = Object.fromEntries(
        Object.entries(body).filter(([key]) => editableFields.includes(key))
    );
    if (!Object.keys(payload).length) return null;
    if (!partial && editableFields.some((field) => payload[field] === undefined)) return null;
    if (payload.name !== undefined && (typeof payload.name !== "string" || !payload.name.trim())) return null;
    if (payload.category !== undefined && (typeof payload.category !== "string" || !payload.category.trim())) return null;
    if (payload.description !== undefined && typeof payload.description !== "string") return null;
    if (payload.image !== undefined && typeof payload.image !== "string") return null;
    if (payload.status !== undefined && !["Active", "Inactive"].includes(payload.status)) return null;
    for (const field of ["price", "stock"]) {
        if (payload[field] !== undefined && (!Number.isFinite(Number(payload[field])) || Number(payload[field]) < 0)) {
            return null;
        }
        if (payload[field] !== undefined) payload[field] = Number(payload[field]);
    }
    if (payload.stock !== undefined && !Number.isInteger(payload.stock)) return null;
    return payload;
};

const presentProduct = (product) => ({
    ...product,
    id: product._id.toString(),
});

export const getAllProducts = async (req, res) => {
    const query = req.admin ? {} : { status: "Active" };
    if (typeof req.query.category === "string" && req.query.category.length <= 80) {
        query.category = req.query.category.trim();
    }
    if (typeof req.query.search === "string" && req.query.search.length <= 100) {
        const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.name = { $regex: search, $options: "i" };
    }
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ status: "success", data: products.map(presentProduct) });
};

export const addProducts = async (req, res) => {
    const payload = productPayload(req.body);
    if (!payload) {
        return res.status(400).json({ status: "failed", message: "Invalid product data" });
    }
    const product = await Product.create(payload);
    return res.status(201).json({ status: "success", data: presentProduct(product.toObject()) });
};

export const getProductById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id).lean();
    if (!product || (!req.admin && product.status !== "Active")) {
        return res.status(404).json({ status: "failed", message: "Product not found" });
    }
    return res.status(200).json({ status: "success", data: presentProduct(product) });
};

export const updateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid product id" });
    }
    const payload = productPayload(req.body, true);
    if (!payload) {
        return res.status(400).json({ status: "failed", message: "Invalid product data" });
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: payload },
        { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ status: "failed", message: "Product not found" });
    return res.status(200).json({ status: "success", data: presentProduct(product.toObject()) });
};

export const deleteProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid product id" });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ status: "failed", message: "Product not found" });
    return res.status(200).json({ status: "success", message: "Product deleted" });
};
