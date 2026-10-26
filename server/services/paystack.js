import crypto from "node:crypto";
import { AdminRecord } from "../models/AdminRecord.js";
import { User } from "../models/userSchema.js";
import { Product } from "../models/Product.js";
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

export const initializePaystackTransaction = (
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
) =>
  paystackRequest("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email,
      amount,
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

export const verifyPaystackTransaction = (reference) =>
  paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);

export const isValidPaystackSignature = (rawBody, signature) => {
  if (
    !rawBody ||
    typeof signature !== "string" ||
    !process.env.PAYSTACK_SECRET_KEY
  )
    return false;
  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest();
  let received;
  try {
    received = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return (
    received.length === expected.length &&
    crypto.timingSafeEqual(received, expected)
  );
};

// Conditional decrements prevent concurrent orders from reserving the same units.
export const reserveInventory = async (items) => {
  const reserved = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, status: "Active" },
      { $inc: { stock: -item.quantity } },
    );
    if (result.modifiedCount !== 1) {
      await releaseInventory(reserved);
      return false;
    }
    reserved.push(item);
  }
  return true;
};

export const releaseInventory = async (items) => {
  await Promise.all(
    (items ?? []).map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      ),
    ),
  );
};

export const releaseExpiredReservations = async () => {
  const now = new Date();
  let released = 0;
  while (true) {
    const order = await AdminRecord.findOneAndUpdate(
      {
        resource: "order",
        "payload.inventoryReserved": true,
        "payload.reservationExpiresAt": { $lte: now },
        "payload.paymentStatus": { $ne: "Paid" },
      },
      {
        $set: {
          "payload.inventoryReserved": false,
          "payload.paymentStatus": "Expired",
          "payload.status": "Cancelled",
        },
      },
      { returnDocument: "after" },
    );
    if (!order) break;
    await releaseInventory(order.payload.items);
    released += 1;
  }
  return released;
};

export const markOrderPaid = async (transaction) => {
  if (
    !transaction ||
    transaction.status !== "success" ||
    transaction.currency !== "NGN"
  )
    return null;
  let order = await AdminRecord.findOne({
    resource: "order",
    "payload.paymentReference": transaction.reference,
  });
  if (
    !order ||
    Number(transaction.amount) !== Math.round(Number(order.payload.total) * 100)
  )
    return null;

  if (order.payload.paymentStatus !== "Paid") {
    // Atomically claim the reservation so callbacks and webhooks cannot sell twice.
    order = await AdminRecord.findOneAndUpdate(
      {
        _id: order._id,
        resource: "order",
        "payload.paymentReference": transaction.reference,
        "payload.paymentStatus": { $ne: "Paid" },
        "payload.status": { $ne: "Cancelled" },
        "payload.inventoryReserved": true,
      },
      {
        $set: {
          "payload.payment": "Paid",
          "payload.paymentStatus": "Paid",
          "payload.paymentMethod": order.payload.paymentMethod || "Paystack",
          "payload.status": "Processing",
          "payload.paidAt": transaction.paid_at || new Date().toISOString(),
          "payload.paystackTransactionId": String(transaction.id),
          "payload.inventoryReserved": false,
        },
      },
      { returnDocument: "after" },
    );
    if (!order) return null;
    await User.updateOne({ _id: order.createdBy }, { $set: { cart: [] } });
  }

  if (!order.payload.receiptSentAt) {
    try {
      await sendPaymentReceiptEmail(order.payload);
      order.payload = {
        ...order.payload,
        receiptSentAt: new Date().toISOString(),
      };
      await order.save();
    } catch (error) {
      console.error("Payment receipt email could not be sent:", error.message);
    }
  }
  return order;
};

export const generateReceiptNumber = (orderDate) => {
  const date = orderDate ? new Date(orderDate) : new Date();
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const seq = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RCP-${yy}${mm}${dd}-${seq}`;
};

export const confirmBankTransferPayment = async (
  order,
  transactionReference,
  adminUserId,
) => {
  if (
    !order ||
    order.resource !== "order" ||
    order.payload.paymentStatus === "Paid"
  )
    return null;

  const confirmedOrder = await AdminRecord.findOneAndUpdate(
    {
      _id: order._id,
      resource: "order",
      "payload.paymentStatus": { $ne: "Paid" },
      "payload.status": { $ne: "Cancelled" },
      ...(order.payload.inventoryReserved
        ? { "payload.inventoryReserved": true }
        : {}),
    },
    {
      $set: {
        "payload.payment": "Paid",
        "payload.paymentStatus": "Paid",
        "payload.paymentMethod": "Bank Transfer",
        "payload.status": "Processing",
        "payload.paidAt": new Date().toISOString(),
        "payload.transactionReference":
          typeof transactionReference === "string" &&
          transactionReference.trim()
            ? transactionReference.trim().slice(0, 200)
            : "",
        "payload.paymentConfirmedBy": adminUserId?.toString() ?? "",
        "payload.paymentConfirmationDate": new Date().toISOString(),
        "payload.receiptNumber": generateReceiptNumber(),
        "payload.inventoryReserved": false,
      },
    },
    { returnDocument: "after" },
  );

  if (!confirmedOrder) return null;

  await User.updateOne(
    { _id: confirmedOrder.createdBy },
    { $set: { cart: [] } },
  );

  if (!confirmedOrder.payload.receiptSentAt) {
    try {
      await sendPaymentReceiptEmail(confirmedOrder.payload);
      confirmedOrder.payload = {
        ...confirmedOrder.payload,
        receiptSentAt: new Date().toISOString(),
      };
      await confirmedOrder.save();
    } catch (error) {
      console.error("Payment receipt email could not be sent:", error.message);
    }
  }

  return confirmedOrder;
};
