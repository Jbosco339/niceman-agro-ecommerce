const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL in the client .env file.");
}

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

const adminRequest = api;

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
  return adminRequest("/admin/products");
};

export const getProduct = async (id) => {
  return adminRequest(`/admin/products/${encodeURIComponent(id)}`);
};

export const createProduct = async (product) => {
  return adminRequest("/admin/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
};

export const updateProduct = async (id, product) => {
  return adminRequest(`/admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
};

export const deleteProduct = async (id) => {
  return adminRequest(`/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ==================== CATEGORIES ====================

export const getCategories = async () => {
  return adminRequest("/admin/categories");
};

export const getCategory = async (id) => {
  return adminRequest(`/admin/categories/${encodeURIComponent(id)}`);
};

export const createCategory = async (category) => {
  return adminRequest("/admin/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
};

export const updateCategory = async (id, category) => {
  return adminRequest(`/admin/categories/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
};

export const deleteCategory = async (id) => {
  return adminRequest(`/admin/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ==================== ORDERS ====================

export const getOrders = async () => {
  return adminRequest("/admin/orders");
};

export const getOrder = async (id) => {
  return adminRequest(`/admin/orders/${encodeURIComponent(id)}`);
};

export const updateOrderStatus = async (id, status) => {
  return adminRequest(`/admin/orders/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const confirmPayment = async (id, transactionReference) => {
  return adminRequest(`/orders/${encodeURIComponent(id)}/confirm-payment`, {
    method: "POST",
    body: JSON.stringify({ transactionReference }),
  });
};

// ==================== CUSTOMERS ====================

export const getCustomers = async () => {
  return adminRequest("/admin/customers");
};

export const getCustomer = async (id) => {
  return adminRequest(`/admin/customers/${encodeURIComponent(id)}`);
};

export const updateCustomer = async (id, customer) => {
  return adminRequest(`/admin/customers/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(customer),
  });
};

export const deleteCustomer = async (id) => {
  return adminRequest(`/admin/customers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ==================== REVIEWS ====================

export const getReviews = async () => {
  return adminRequest("/admin/reviews");
};

export const updateReviewStatus = async (id, status) => {
  return adminRequest(`/admin/reviews/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteReview = async (id) => {
  return adminRequest(`/admin/reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ==================== PROMOTIONS ====================

export const getPromotions = async () => {
  return adminRequest("/admin/promotions");
};

export const createPromotion = async (promotion) => {
  return adminRequest("/admin/promotions", {
    method: "POST",
    body: JSON.stringify(promotion),
  });
};

export const updatePromotion = async (id, promotion) => {
  return adminRequest(`/admin/promotions/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(promotion),
  });
};

export const deletePromotion = async (id) => {
  return adminRequest(`/admin/promotions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ==================== BLOG ====================

export const getBlogPosts = async () => {
  return adminRequest("/admin/blog");
};

export const getBlogPost = async (id) => {
  return adminRequest(`/admin/blog/${encodeURIComponent(id)}`);
};

export const createBlogPost = async (post) => {
  return adminRequest("/admin/blog", {
    method: "POST",
    body: JSON.stringify(post),
  });
};

export const updateBlogPost = async (id, post) => {
  return adminRequest(`/admin/blog/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
};

export const deleteBlogPost = async (id) => {
  return adminRequest(`/admin/blog/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ==================== WEBSITE CONTENT ====================

export const getWebsiteContent = async () => {
  return adminRequest("/admin/website-content");
};

export const updateWebsiteContent = async (content) => {
  return adminRequest("/admin/website-content", {
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
  confirmPayment,

  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,

  getReviews,
  updateReviewStatus,
  deleteReview,

  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,

  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,

  getWebsiteContent,
  updateWebsiteContent,
};
