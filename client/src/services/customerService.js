import { get, put, del } from "./api";

// ==================== CUSTOMER PROFILE ====================

export const getCustomerProfile = async () => {
  return get("/customers/profile");
};

export const updateCustomerProfile = async (customerData) => {
  return put("/customers/profile", customerData);
};

// ==================== CUSTOMER ORDERS ====================

export const getMyOrders = async () => {
  return get("/customers/orders");
};

export const getMyOrder = async (orderId) => {
  return get(`/customers/orders/${orderId}`);
};

// ==================== CUSTOMER ADDRESS ====================

export const getCustomerAddresses = async () => {
  return get("/customers/addresses");
};

export const addCustomerAddress = async (address) => {
  return put("/customers/addresses", address);
};

export const deleteCustomerAddress = async (addressId) => {
  return del(`/customers/addresses/${addressId}`);
};

// ==================== CUSTOMER ACCOUNT ====================

export const deleteCustomerAccount = async () => {
  return del("/customers/account");
};

export default {
  getCustomerProfile,
  updateCustomerProfile,
  getMyOrders,
  getMyOrder,
  getCustomerAddresses,
  addCustomerAddress,
  deleteCustomerAddress,
  deleteCustomerAccount,
};