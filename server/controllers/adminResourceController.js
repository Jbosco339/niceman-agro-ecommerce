import mongoose from "mongoose";
import { AdminRecord } from "../models/AdminRecord.js";
import { User } from "../models/userSchema.js";

const fields = {
    category: ["name", "description", "image", "status", "products"],
    order: ["customer", "email", "items", "total", "payment", "paymentMethod", "paymentStatus", "deliveryFee", "status", "date", "address"],
    review: ["product", "customer", "email", "rating", "comment", "status", "date"],
    promotion: ["name", "title", "description", "code", "type", "value", "discount", "usage", "startDate", "endDate", "status"],
    article: ["title", "category", "author", "excerpt", "content", "image", "status", "date"],
};

const inputPayload = (resource, value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    if (resource === "website-content") {
        const serialized = JSON.stringify(value);
        return serialized.length <= 20000 && hasSafeKeys(value) ? value : null;
    }

    const allowed = fields[resource];
    if (!allowed) return null;

    const payload = Object.fromEntries(
        Object.entries(value).filter(([key]) => allowed.includes(key))
    );
    if (!Object.keys(payload).length) return null;
    if (!hasSafeKeys(payload)) return null;
    if (resource === "category" && (typeof payload.name !== "string" || !payload.name.trim())) return null;
    if (resource === "article" && (typeof payload.title !== "string" || !payload.title.trim())) return null;
    const stringLimits = {
        name: 120, description: 3000, image: 2048, status: 32, customer: 120,
        email: 254, payment: 32, date: 64, address: 1000, product: 120,
        comment: 3000, title: 200, code: 64, startDate: 64, endDate: 64,
        category: 80, author: 120, content: 20000, type: 32, value: 32, usage: 32,
    };
    for (const [key, value] of Object.entries(payload)) {
        if (typeof value === "string" && value.length > (stringLimits[key] ?? 500)) return null;
    }
    if (payload.image !== undefined && payload.image !== "" &&
        !(payload.image.startsWith("/") && !payload.image.startsWith("//")) &&
        !/^https?:\/\/[^\s]+$/i.test(payload.image)) return null;
    if (resource === "order" && Array.isArray(payload.items)) {
        if (payload.items.length > 100 || !payload.items.every((item) =>
            item && typeof item === "object" && typeof item.name === "string" &&
            Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0 &&
            Number.isFinite(Number(item.price)) && Number(item.price) >= 0
        )) return null;
        payload.items = payload.items.map((item) => ({
            name: item.name.slice(0, 120),
            quantity: Number(item.quantity),
            price: Number(item.price),
        }));
    }
    for (const field of ["products", "items", "total", "rating", "discount", "deliveryFee", "value", "usage"]) {
        if (field === "items" && Array.isArray(payload.items)) continue;
        if (payload[field] !== undefined &&
            (!Number.isFinite(Number(payload[field])) || Number(payload[field]) < 0)) return null;
        if (payload[field] !== undefined) payload[field] = Number(payload[field]);
    }
    const validStatuses = {
        category: ["Active", "Inactive"],
        order: ["Pending", "Processing", "Delivered", "Cancelled"],
        review: ["Pending", "Approved", "Rejected"],
        promotion: ["Active", "Inactive", "Expired"],
        article: ["Draft", "Published"],
    };
    if (payload.status !== undefined && !validStatuses[resource]?.includes(payload.status)) return null;
    return payload;
};

const hasSafeKeys = (value, depth = 0) => {
    if (depth > 5) return false;
    if (Array.isArray(value)) return value.every((item) => hasSafeKeys(item, depth + 1));
    if (value && typeof value === "object") {
        return Object.entries(value).every(([key, nested]) =>
            !key.startsWith("$") && !key.includes(".") &&
            !["__proto__", "prototype", "constructor"].includes(key) &&
            hasSafeKeys(nested, depth + 1)
        );
    }
    return typeof value !== "string" || value.length <= 20000;
};

export const validateAdminPayload = inputPayload;

const present = (record) => ({
    ...record.payload,
    ...(record.resource === "promotion" && {
        name: record.payload.name ?? record.payload.title ?? "",
        value: record.payload.value ?? record.payload.discount ?? 0,
    }),
    id: record._id.toString(),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
});

export const listAdminRecords = (resource) => async (_req, res) => {
    const records = await AdminRecord.find({ resource }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: records.map(present) });
};

export const getAdminRecord = (resource) => async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid record id" });
    }
    const record = await AdminRecord.findOne({ _id: req.params.id, resource });
    if (!record) return res.status(404).json({ status: "failed", message: "Record not found" });
    return res.status(200).json({ status: "success", data: present(record) });
};

export const createAdminRecord = (resource) => async (req, res) => {
    const payload = inputPayload(resource, req.body);
    if (!payload) {
        return res.status(400).json({ status: "failed", message: "Invalid or empty request data" });
    }
    const record = await AdminRecord.create({ resource, payload, createdBy: req.user._id });
    return res.status(201).json({ status: "success", data: present(record) });
};

export const updateAdminRecord = (resource) => async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid record id" });
    }
    const payload = inputPayload(resource, req.body);
    if (!payload) {
        return res.status(400).json({ status: "failed", message: "Invalid or empty request data" });
    }
    const existing = await AdminRecord.findOne({ _id: req.params.id, resource });
    if (!existing) return res.status(404).json({ status: "failed", message: "Record not found" });
    const record = await AdminRecord.findOneAndUpdate(
        { _id: req.params.id, resource },
        { $set: { payload: { ...existing.payload, ...payload } } },
        { new: true, runValidators: true }
    );
    return res.status(200).json({ status: "success", data: present(record) });
};

export const deleteAdminRecord = (resource) => async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid record id" });
    }
    const record = await AdminRecord.findOneAndDelete({ _id: req.params.id, resource });
    if (!record) return res.status(404).json({ status: "failed", message: "Record not found" });
    return res.status(200).json({ status: "success", message: "Record deleted" });
};

export const listCustomers = async (_req, res) => {
    const customers = await User.find({ role: "user" })
        .select("userName email image isVerified isActive createdAt")
        .sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        data: customers.map((user) => ({
            id: user._id.toString(),
            name: user.userName,
            email: user.email,
            phone: user.phone ?? "",
            image: user.image,
            status: user.isActive ? "Active" : "Inactive",
            createdAt: user.createdAt,
            orders: 0,
            totalSpent: 0,
        })),
    });
};

export const getCustomer = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid customer id" });
    }
    const user = await User.findOne({ _id: req.params.id, role: "user" })
        .select("userName email image isVerified isActive createdAt");
    if (!user) return res.status(404).json({ status: "failed", message: "Customer not found" });
    const orders = await AdminRecord.find({
        resource: "order",
        $or: [
            { "payload.email": user.email },
            { "payload.customer": user.userName },
            { "payload.customer.name": user.userName },
        ],
    }).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        data: {
            id: user._id.toString(),
            name: user.userName,
            email: user.email,
            phone: user.phone ?? "",
            image: user.image,
            status: user.isActive ? "Active" : "Inactive",
            createdAt: user.createdAt,
            orderCount: orders.length,
            totalSpent: orders.reduce((total, order) => total + Number(order.payload.total ?? 0), 0),
            orders: orders.map(present),
        },
    });
};

export const deleteCustomer = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid customer id" });
    }
    const user = await User.findOneAndDelete({ _id: req.params.id, role: "user" });
    if (!user) return res.status(404).json({ status: "failed", message: "Customer not found" });
    return res.status(200).json({ status: "success", message: "Customer deleted" });
};

export const updateCustomer = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: "failed", message: "Invalid customer id" });
    }
    const { userName, image, status } = req.body ?? {};
    if ((userName !== undefined && typeof userName !== "string") ||
        (image !== undefined && typeof image !== "string") ||
        (status !== undefined && !["Active", "Inactive"].includes(status))) {
        return res.status(400).json({ status: "failed", message: "Invalid customer data" });
    }
    const update = {
        ...(userName !== undefined && { userName }),
        ...(image !== undefined && { image }),
        ...(status !== undefined && { isActive: status === "Active" }),
    };
    const user = await User.findOneAndUpdate(
        { _id: req.params.id, role: "user" },
        { $set: update },
        { new: true, runValidators: true }
    ).select("userName email image isVerified isActive createdAt");
    if (!user) return res.status(404).json({ status: "failed", message: "Customer not found" });
    return res.status(200).json({
        status: "success",
        data: {
            id: user._id.toString(),
            name: user.userName,
            email: user.email,
            image: user.image,
            status: user.isActive ? "Active" : "Inactive",
            createdAt: user.createdAt,
        },
    });
};
