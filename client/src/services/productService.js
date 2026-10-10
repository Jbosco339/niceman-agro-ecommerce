import { get } from "./api";
import adminService from "./adminService";

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
  return adminService.createProduct(product);
};

export const updateProduct = async (id, product) => {
  return adminService.updateProduct(id, product);
};

export const deleteProduct = async (id) => {
  return adminService.deleteProduct(id);
};

export const updateProductStock = async (id, stock) => {
  return adminService.updateProduct(id, { stock });
};

export const toggleProductStatus = async (id, status) => {
  return adminService.updateProduct(id, { status });
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