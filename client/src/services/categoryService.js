import { get, post, put, del } from "./api";

// ==================== PUBLIC CATEGORIES ====================

export const getCategories = async () => {
  return get("/categories");
};

export const getCategory = async (id) => {
  return get(`/categories/${id}`);
};

export const getCategoryBySlug = async (slug) => {
  return get(`/categories/slug/${slug}`);
};

// ==================== ADMIN CATEGORIES ====================

export const createCategory = async (category) => {
  return post("/categories", category);
};

export const updateCategory = async (id, category) => {
  return put(`/categories/${id}`, category);
};

export const deleteCategory = async (id) => {
  return del(`/categories/${id}`);
};

export const toggleCategoryStatus = async (id, status) => {
  return put(`/categories/${id}`, {
    status,
  });
};

export default {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};