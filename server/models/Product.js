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
            default: "",
            maxlength: 2048,
            validate(value) {
                return !value || value.startsWith("/") && !value.startsWith("//") ||
                    /^https?:\/\/[^\s]+$/i.test(value);
            },
        },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
