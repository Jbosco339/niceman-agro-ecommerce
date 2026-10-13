import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "./.env" });

// create a transporter from nodemailer 
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com", //smtp = simple mail transfer protocol
    port: Number(process.env.EMAIL_PORT || 587),  //or 465
    secure: Number(process.env.EMAIL_PORT || 587) === 465,
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

export const sendPaymentReceiptEmail = async (order) => {
    if (!process.env.EMAIL_USER) throw new Error("Email service is not configured");
    const customer = order.customer ?? {};
    const customerName = typeof customer === "object" ? customer.name : customer;
    const email = customer.email || order.email;
    if (!email) throw new Error("Receipt email address is missing");
    const rows = (order.items ?? []).map((item) => `
        <tr><td>${escapeHtml(item.name)}</td><td>${Number(item.quantity) || 0}</td>
        <td>NGN ${(Number(item.price) || 0).toLocaleString()}</td>
        <td>NGN ${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</td></tr>`).join("");
    const receiptNumber = order.receiptNumber || `RCP-${Date.now()}`;
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Payment receipt for order ${escapeHtml(order.orderNumber || order.paymentReference || "")}`,
        html: `<h2>Payment received</h2>
            <p>Hello ${escapeHtml(customerName || "Customer")},</p>
            <p>We received your payment for order <strong>${escapeHtml(order.orderNumber || "")}</strong>.</p>
            <p>Payment reference: ${escapeHtml(order.paymentReference || "")}</p>
            <p>Receipt number: <strong>${escapeHtml(receiptNumber)}</strong></p>
            <p>Payment method: ${escapeHtml(order.paymentMethod || "Bank Transfer")}</p>
            <p>Payment confirmation date: ${escapeHtml(order.paymentConfirmationDate || order.paidAt || new Date().toISOString())}</p>
            <table cellpadding="8" cellspacing="0" border="1"><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
            <p>Delivery fee: NGN ${(Number(order.deliveryFee) || 0).toLocaleString()}</p>
            <p><strong>Total paid: NGN ${(Number(order.total) || 0).toLocaleString()}</strong></p>
            <p>Payment status: Paid</p>
            <p>You can download this receipt at any time from your <a href="${escapeHtml(process.env.CLIENT_URL || "")}/account/orders/${escapeHtml(order.id || "")}">order page</a>.</p>`,
    });
};

export const sendOrderNotificationEmail = async (order) => {
    if (!process.env.EMAIL_USER) throw new Error("Email service is not configured");
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error("Admin email is not configured");
    const customer = order.customer ?? {};
    const customerName = typeof customer === "object" ? customer.name : customer;
    const rows = (order.items ?? []).map((item) => `
        <tr><td>${escapeHtml(item.name)}</td><td>${Number(item.quantity) || 0}</td>
        <td>NGN ${(Number(item.price) || 0).toLocaleString()}</td>
        <td>NGN ${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</td></tr>`).join("");
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New order notification: ${escapeHtml(order.orderNumber || "")}`,
        html: `<h2>New order received</h2>
            <p>A new order has been placed.</p>
            <p>Order number: <strong>${escapeHtml(order.orderNumber || "")}</strong></p>
            <p>Customer: ${escapeHtml(customerName || "—")}</p>
            <p>Email: ${escapeHtml(order.email || "—")}</p>
            <p>Phone: ${escapeHtml((typeof customer === "object" ? customer.phone : "") || "")}</p>
            <p>Total: NGN ${(Number(order.total) || 0).toLocaleString()}</p>
            <p>Payment method: ${escapeHtml(order.paymentMethod || "Pending")}</p>
            <p>Payment status: ${escapeHtml(order.paymentStatus || order.payment || "")}</p>
            <p>Order date: ${escapeHtml(order.date || new Date().toISOString())}</p>
            <table cellpadding="8" cellspacing="0" border="1"><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
            <p>View order in admin dashboard.</p>`,
    });
};
