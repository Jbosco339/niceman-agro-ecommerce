const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong with the API request."
    );
  }

  return data;
};

export const get = (endpoint) =>
  api(endpoint, {
    method: "GET",
  });

export const post = (endpoint, data) =>
  api(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const put = (endpoint, data) =>
  api(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const patch = (endpoint, data) =>
  api(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const del = (endpoint) =>
  api(endpoint, {
    method: "DELETE",
  });

export default api;