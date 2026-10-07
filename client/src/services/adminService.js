const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const adminRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin request failed");
  }

  return data;
};

// ==================== AUTH ====================

export const adminLogin = async (credentials) => {
  return adminRequest("/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const adminLogout = async () => {
  return adminRequest("/admin/logout", {
    method: "POST",
  });
};

export const getCurrentAdmin = async () => {
  return adminRequest("/admin/me");
};

// ==================== DASHBOARD ====================

export const getAdminDashboard = async () => {
  return adminRequest("/admin/dashboard");
};

// ==================== PRODUCTS ====================

export const getProducts = async () => {
  return adminRequest("/products");
};

export const getProduct = async (id) => {
  return adminRequest(`/products/${id}`);
};

export const createProduct = async (product) => {
  return adminRequest("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
};

export const updateProduct = async (id, product) => {
  return adminRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
};

export const deleteProduct = async (id) => {
  return adminRequest(`/products/${id}`, {
    method: "DELETE",
  });
};

// ==================== CATEGORIES ====================

export const getCategories = async () => {
  return adminRequest("/categories");
};

export const getCategory = async (id) => {
  return adminRequest(`/categories/${id}`);
};

export const createCategory = async (category) => {
  return adminRequest("/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
};

export const updateCategory = async (id, category) => {
  return adminRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
};

export const deleteCategory = async (id) => {
  return adminRequest(`/categories/${id}`, {
    method: "DELETE",
  });
};

// ==================== ORDERS ====================

export const getOrders = async () => {
  return adminRequest("/orders");
};

export const getOrder = async (id) => {
  return adminRequest(`/orders/${id}`);
};

export const updateOrderStatus = async (id, status) => {
  return adminRequest(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ==================== CUSTOMERS ====================

export const getCustomers = async () => {
  return adminRequest("/customers");
};

export const getCustomer = async (id) => {
  return adminRequest(`/customers/${id}`);
};

export const updateCustomer = async (id, customer) => {
  return adminRequest(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(customer),
  });
};

// ==================== REVIEWS ====================

export const getReviews = async () => {
  return adminRequest("/reviews");
};

export const updateReviewStatus = async (id, status) => {
  return adminRequest(`/reviews/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteReview = async (id) => {
  return adminRequest(`/reviews/${id}`, {
    method: "DELETE",
  });
};

// ==================== PROMOTIONS ====================

export const getPromotions = async () => {
  return adminRequest("/promotions");
};

export const createPromotion = async (promotion) => {
  return adminRequest("/promotions", {
    method: "POST",
    body: JSON.stringify(promotion),
  });
};

export const updatePromotion = async (id, promotion) => {
  return adminRequest(`/promotions/${id}`, {
    method: "PUT",
    body: JSON.stringify(promotion),
  });
};

export const deletePromotion = async (id) => {
  return adminRequest(`/promotions/${id}`, {
    method: "DELETE",
  });
};

// ==================== BLOG ====================

export const getBlogPosts = async () => {
  return adminRequest("/blog");
};

export const createBlogPost = async (post) => {
  return adminRequest("/blog", {
    method: "POST",
    body: JSON.stringify(post),
  });
};

export const updateBlogPost = async (id, post) => {
  return adminRequest(`/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
};

export const deleteBlogPost = async (id) => {
  return adminRequest(`/blog/${id}`, {
    method: "DELETE",
  });
};

// ==================== WEBSITE CONTENT ====================

export const getWebsiteContent = async () => {
  return adminRequest("/website-content");
};

export const updateWebsiteContent = async (content) => {
  return adminRequest("/website-content", {
    method: "PUT",
    body: JSON.stringify(content),
  });
};

export default {
  adminLogin,
  adminLogout,
  getCurrentAdmin,
  getAdminDashboard,

  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,

  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,

  getOrders,
  getOrder,
  updateOrderStatus,

  getCustomers,
  getCustomer,
  updateCustomer,

  getReviews,
  updateReviewStatus,
  deleteReview,

  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,

  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,

  getWebsiteContent,
  updateWebsiteContent,
};