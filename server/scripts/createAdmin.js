import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import { User } from "../models/userSchema.js";
import { sendVerificationEmail } from "../config/email.js";
import { emailVerificationEnabled } from "../utils/verification.js";

dotenv.config({ path: "./.env" });

const { MONGODB_URL, JWT_SECRET, API_URL, ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URL || !JWT_SECRET || !API_URL || !ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSWORD) {
    throw new Error("Set MONGODB_URL, JWT_SECRET, API_URL, ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD before provisioning an administrator");
}
if (JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
}

await mongoose.connect(MONGODB_URL);
try {
    const email = ADMIN_EMAIL.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error("That email already has an account; administrator provisioning will not modify an existing user");
    }
    const administrator = await User.create({
        userName: ADMIN_NAME.trim(),
        email,
        password: ADMIN_PASSWORD,
        role: "admin",
        isVerified: !emailVerificationEnabled(),
    });
    if (emailVerificationEnabled()) {
        const verificationToken = jwt.sign(
            { id: administrator._id, email, tokenType: "verification" },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
        administrator.verificationToken = createHash("sha256").update(verificationToken).digest("hex");
        await administrator.save();
        try {
            await sendVerificationEmail(
                administrator,
                `${API_URL}/user/verify-email/${verificationToken}`
            );
        } catch {
            await User.deleteOne({ email });
            throw new Error("Administrator created but verification email could not be sent; the unverified account was removed");
        }
    }
    console.log("Administrator account created successfully.");
} finally {
    await mongoose.disconnect();
}
