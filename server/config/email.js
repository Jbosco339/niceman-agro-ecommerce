import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "./.env" });

// create a transporter from nodemailer 
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com", //smtp = simple mail transfer protocol
    port: Number(process.env.EMAIL_PORT || 587),  //or 465
    secure: process.env.NODE_ENV === "production",
    ...(process.env.EMAIL_USER && process.env.EMAIL_PASS
        ? { auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } }
        : {}),
});

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
}[character]));

export const sendVerificationEmail = async (user, verificationLink) => {
    if (!process.env.EMAIL_USER) {
        throw new Error("Email service is not configured");
    }
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your email",
        html: `
            <h2>Welcome ${escapeHtml(user.userName)}!</h2>
            <p>Please use the link below to verify your email.</p>
            <p><a href="${escapeHtml(verificationLink)}">Verify email</a></p>
        `,
    });
};

export const sendPasswordResetEmail = async (user, resetLink) => {
    if (!process.env.EMAIL_USER) {
        throw new Error("Email service is not configured");
    }
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your password",
        html: `
            <p>Hello ${escapeHtml(user.userName)},</p>
            <p>Use the link below to reset your password. It expires in one hour.</p>
            <p><a href="${escapeHtml(resetLink)}">Reset password</a></p>
        `,
    });
};