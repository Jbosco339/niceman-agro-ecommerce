import express from "express";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/adminMiddleware.js";
import { getAdminDashboard, getCurrentAdmin, loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import {
    createAdminRecord,
    deleteAdminRecord,
    getAdminRecord,
    listAdminRecords,
    listCustomers,
    getCustomer,
    updateCustomer,
    updateAdminRecord,
    deleteCustomer,
} from "../controllers/adminResourceController.js";
import { addProducts, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import { validateAdminPayload } from "../controllers/adminResourceController.js";
import { AdminRecord } from "../models/AdminRecord.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

router.post("/login", adminLoginLimiter, loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", auth, admin, getCurrentAdmin);
router.get("/dashboard", auth, admin, getAdminDashboard);
router.route("/products")
    .get(auth, admin, (req, res, next) => {
        req.admin = true;
        return getAllProducts(req, res, next);
    })
    .post(auth, admin, addProducts);
router.route("/products/:id")
    .get(auth, admin, (req, res, next) => {
        req.admin = true;
        return getProductById(req, res, next);
    })
    .put(auth, admin, updateProduct)
    .patch(auth, admin, updateProduct)
    .delete(auth, admin, deleteProduct);

const registerResource = (path, resource) => {
    router.route(path)
        .get(auth, admin, listAdminRecords(resource))
        .post(auth, admin, createAdminRecord(resource));
    router.route(`${path}/:id`)
        .get(auth, admin, getAdminRecord(resource))
        .put(auth, admin, updateAdminRecord(resource))
        .patch(auth, admin, updateAdminRecord(resource))
        .delete(auth, admin, deleteAdminRecord(resource));
};

registerResource("/categories", "category");
registerResource("/orders", "order");
registerResource("/reviews", "review");
registerResource("/promotions", "promotion");
registerResource("/blog", "article");

router.get("/customers", auth, admin, listCustomers);
router.get("/customers/:id", auth, admin, getCustomer);
router.put("/customers/:id", auth, admin, updateCustomer);
router.delete("/customers/:id", auth, admin, deleteCustomer);
router.get("/website-content", auth, admin, async (_req, res) => {
    const record = await AdminRecord.findOne({ resource: "website-content" }).sort({ updatedAt: -1 });
    return res.status(200).json({ status: "success", data: record?.payload ?? {} });
});
router.put("/website-content", auth, admin, async (req, res) => {
    const payload = validateAdminPayload("website-content", req.body);
    if (!payload) {
        return res.status(400).json({ status: "failed", message: "Invalid website content" });
    }
    const existing = await AdminRecord.findOneAndUpdate(
        { resource: "website-content" },
        {
            $set: { payload },
            $setOnInsert: { createdBy: req.user._id },
        },
        { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({ status: "success", data: existing.payload });
});

export default router;
