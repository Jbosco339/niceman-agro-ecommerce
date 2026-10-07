import { get, post, put, del } from "./api";

// ==================== PUBLIC BLOG ====================

export const getPublishedPosts = async () => {
  return get("/blog?status=Published");
};

export const getBlogPost = async (id) => {
  return get(`/blog/${id}`);
};

export const getBlogPostsByCategory = async (category) => {
  return get(`/blog?category=${encodeURIComponent(category)}`);
};

// ==================== ADMIN BLOG ====================

export const getAllBlogPosts = async () => {
  return get("/blog");
};

export const createBlogPost = async (post) => {
  return post("/blog", post);
};

export const updateBlogPost = async (id, updatedPost) => {
  return put(`/blog/${id}`, updatedPost);
};

export const deleteBlogPost = async (id) => {
  return del(`/blog/${id}`);
};

export const toggleBlogPostStatus = async (id, status) => {
  return put(`/blog/${id}`, {
    status,
  });
};

export default {
  getPublishedPosts,
  getBlogPost,
  getBlogPostsByCategory,
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogPostStatus,
};