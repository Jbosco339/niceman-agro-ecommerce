import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
        category: { type: String, required: true, trim: true, maxlength: 80 },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
        description: { type: String, required: true, trim: true, maxlength: 5000 },
        image: {
            type: String,
            required: true,
            maxlength: 2048,
            validate(value) {
                if (!value) return false;
                try {
                    const url = new URL(value);
                    return url.protocol === "https:" &&
                        url.hostname === "res.cloudinary.com" &&
                        /^\/[^/]+\/image\/upload\//.test(url.pathname);
                } catch {
                    return false;
                }
            },
        },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
