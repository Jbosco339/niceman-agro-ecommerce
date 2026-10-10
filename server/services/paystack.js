import crypto from "node:crypto";
import { AdminRecord } from "../models/AdminRecord.js";
import { User } from "../models/userSchema.js";
import { sendPaymentReceiptEmail } from "../config/email.js";

const paystackRequest = async (path, options = {}) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error("Paystack is not configured");
    const response = await fetch(`https://api.paystack.co${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.status) {
        throw new Error(result.message || "Paystack request failed");
    }
    return result.data;
};

export const initializePaystackTransaction = (email, amount, reference, callbackUrl, metadata) =>
    paystackRequest("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({ email, amount, currency: "NGN", reference, callback_url: callbackUrl, metadata }),
    });

export const verifyPaystackTransaction = (reference) =>
    paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);

export const isValidPaystackSignature = (rawBody, signature) => {
    if (!rawBody || typeof signature !== "string" || !process.env.PAYSTACK_SECRET_KEY) return false;
    const expected = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest();
    let received;
    try { received = Buffer.from(signature, "hex"); } catch { return false; }
    return received.length === expected.length && crypto.timingSafeEqual(received, expected);
};

export const markOrderPaid = async (transaction) => {
    if (!transaction || transaction.status !== "success" || transaction.currency !== "NGN") return null;
    const order = await AdminRecord.findOne({ resource: "order", "payload.paymentReference": transaction.reference });
    if (!order || Number(transaction.amount) !== Math.round(Number(order.payload.total) * 100)) return null;

    if (order.payload.paymentStatus !== "Paid") {
        order.payload = {
            ...order.payload,
            payment: "Paid",
            paymentStatus: "Paid",
            paymentMethod: "Paystack",
            status: "Processing",
            paidAt: transaction.paid_at || new Date().toISOString(),
            paystackTransactionId: String(transaction.id),
        };
        await order.save();
        await User.updateOne({ _id: order.createdBy }, { $set: { cart: [] } });
    }

    if (!order.payload.receiptSentAt) {
        try {
            await sendPaymentReceiptEmail(order.payload);
            order.payload = { ...order.payload, receiptSentAt: new Date().toISOString() };
            await order.save();
        } catch (error) {
            console.error("Payment receipt email could not be sent:", error.message);
        }
    }
    return order;
};
