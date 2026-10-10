const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = async (endpoint, options = {}) => {
  const requestOptions = {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
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
    const error = new Error(data.message || "Something went wrong with the API request.");
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