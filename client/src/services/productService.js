import { get, post, put, del } from "./api";

// ==================== PUBLIC PRODUCTS ====================

export const getProducts = async () => {
  return get("/products");
};

export const getProduct = async (id) => {
  return get(`/products/${id}`);
};

export const getProductsByCategory = async (category) => {
  return get(
    `/products?category=${encodeURIComponent(category)}`
  );
};

export const searchProducts = async (search) => {
  return get(
    `/products?search=${encodeURIComponent(search)}`
  );
};

// ==================== ADMIN PRODUCTS ====================

export const createProduct = async (product) => {
  return post("/products", product);
};

export const updateProduct = async (id, product) => {
  return put(`/products/${id}`, product);
};

export const deleteProduct = async (id) => {
  return del(`/products/${id}`);
};

export const updateProductStock = async (id, stock) => {
  return put(`/products/${id}/stock`, {
    stock,
  });
};

export const toggleProductStatus = async (id, status) => {
  return put(`/products/${id}/status`, {
    status,
  });
};

export default {
  getProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
};