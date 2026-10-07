import { get, post, put, del } from "./api";

// ==================== PUBLIC REVIEWS ====================

export const getProductReviews = async (productId) => {
  return get(`/reviews/product/${productId}`);
};

export const getReview = async (reviewId) => {
  return get(`/reviews/${reviewId}`);
};

// ==================== CUSTOMER REVIEWS ====================

export const createReview = async (reviewData) => {
  return post("/reviews", reviewData);
};

export const updateReview = async (reviewId, reviewData) => {
  return put(`/reviews/${reviewId}`, reviewData);
};

export const deleteReview = async (reviewId) => {
  return del(`/reviews/${reviewId}`);
};

export const getMyReviews = async () => {
  return get("/reviews/my-reviews");
};

// ==================== ADMIN REVIEWS ====================

export const getAllReviews = async () => {
  return get("/reviews");
};

export const updateReviewStatus = async (reviewId, status) => {
  return put(`/reviews/${reviewId}/status`, {
    status,
  });
};

export const approveReview = async (reviewId) => {
  return updateReviewStatus(reviewId, "Approved");
};

export const rejectReview = async (reviewId) => {
  return updateReviewStatus(reviewId, "Rejected");
};

export default {
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getAllReviews,
  updateReviewStatus,
  approveReview,
  rejectReview,
};