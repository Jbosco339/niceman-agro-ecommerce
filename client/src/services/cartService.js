import { get, post, put, del } from "./api";

// ==================== CART ====================

export const getCart = async () => {
  return get("/cart");
};

export const addToCart = async (productId, quantity = 1) => {
  return post("/cart", {
    productId,
    quantity,
  });
};

export const updateCartItem = async (productId, quantity) => {
  return put(`/cart/${productId}`, {
    quantity,
  });
};

export const removeFromCart = async (productId) => {
  return del(`/cart/${productId}`);
};

export const clearCart = async () => {
  return del("/cart");
};

// ==================== CART TOTALS ====================

export const getCartSummary = async () => {
  return get("/cart/summary");
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
};