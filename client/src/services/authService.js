import { get, post } from "./api";

// ==================== CUSTOMER AUTH ====================

export const registerUser = async (userData) => {
  return post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
  return post("/auth/login", credentials);
};

export const logoutUser = async () => {
  return post("/auth/logout");
};

export const getCurrentUser = async () => {
  return get("/auth/me");
};

// ==================== PASSWORD ====================

export const forgotPassword = async (email) => {
  return post("/auth/forgot-password", { email });
};

export const resetPassword = async (token, password) => {
  return post(`/auth/reset-password/${token}`, {
    password,
  });
};

export const changePassword = async (currentPassword, newPassword) => {
  return post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
};

// ==================== ADMIN AUTH ====================

export const adminLogin = async (credentials) => {
  return post("/admin/login", credentials);
};

export const adminLogout = async () => {
  return post("/admin/logout");
};

export const getCurrentAdmin = async () => {
  return get("/admin/me");
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
  adminLogin,
  adminLogout,
  getCurrentAdmin,
};