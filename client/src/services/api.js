const rawApiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

const normalizeApiBase = (value) => {
  const trimmed = (value || "http://localhost:5000").trim().replace(/\/+$/, "");

  if (!trimmed) return "http://localhost:5000/api/v1";
  if (/\/api\/v1$/i.test(trimmed)) return trimmed;
  if (/\/api$/i.test(trimmed)) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
};

export const API_URL = normalizeApiBase(rawApiBase);

const api = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const requestOptions = {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...options.headers,
    },
  };

  const sendRequest = () => fetch(`${API_URL}${endpoint}`, requestOptions);
  let response = await sendRequest();

  if (
    response.status === 401 &&
    !/\/(login|register|refresh-token)$/.test(endpoint)
  ) {
    const refreshResponse = await fetch(`${API_URL}/user/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshResponse.ok) response = await sendRequest();
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || "Something went wrong with the API request.",
    );
    error.status = response.status;
    throw error;
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

export const upload = (endpoint, formData) =>
  api(endpoint, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
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
