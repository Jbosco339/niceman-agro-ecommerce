import { get, post } from "./api";

// ==================== CHECKOUT ====================

export const calculateCheckout = async (checkoutData) => {
  return post("/checkout/calculate", checkoutData);
};

export const createOrder = async (orderData) => {
  return post("/checkout/order", orderData);
};

export const getCheckoutSummary = async () => {
  return get("/checkout/summary");
};

// ==================== DELIVERY ====================

export const calculateDeliveryFee = async (deliveryData) => {
  return post("/checkout/delivery-fee", deliveryData);
};

// ==================== PAYMENT ====================

export const initializePayment = async (paymentData) => {
  return post("/payments/initialize", paymentData);
};

export const verifyPayment = async (reference) => {
  return get(`/payments/verify/${reference}`);
};

export const cancelPayment = async (orderId) => {
  return post("/payments/cancel", {
    orderId,
  });
};

export default {
  calculateCheckout,
  createOrder,
  getCheckoutSummary,
  calculateDeliveryFee,
  initializePayment,
  verifyPayment,
  cancelPayment,
};