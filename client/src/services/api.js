const rawApiBase =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  window.location.hostname === "www.nicemanagro.com"
    ? "https://niceman-agro-ecommerce.onrender.com/api/v1"
    : import.meta.env.VITE_CLIENT_URL ||
      (typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : ""));

const normalizeApiBase = (value) => {
  const trimmed = (value || "").trim().replace(/\/+$/, "");

  if (!trimmed) {
    return "http://localhost:5000/api/v1";
  }

  if (/\/api\/v1$/i.test(trimmed)) return trimmed;
  if (/\/api$/i.test(trimmed)) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
};

export const API_URL = normalizeApiBase(rawApiBase);

let refreshInFlight = null;

const isAuthEndpoint = (endpoint) =>
  /\/(login|register|refresh-token)$/.test(endpoint);

const clearSessionOnRefreshFailure = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
  }
};

const refreshAccessToken = async () => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = fetch(`${API_URL}/user/refresh-token`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) {
        const responseText = await response.text();
        let message = "Session expired. Please log in again.";

        if (responseText) {
          try {
            const parsed = JSON.parse(responseText);
            message = parsed.message || parsed.error || message;
          } catch {
            message = responseText || message;
          }
        }

        clearSessionOnRefreshFailure();
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      return response;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
};

const api = async (endpoint, options = {}) => {
  const requestOptions = {
    credentials: "include",
    ...options,
    __retriedAfterRefresh: Boolean(options.__retriedAfterRefresh),
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...options.headers,
    },
  };

  const sendRequest = async () =>
    fetch(`${API_URL}${endpoint}`, requestOptions);

  let response = await sendRequest();

  if (
    response.status === 401 &&
    !isAuthEndpoint(endpoint) &&
    !requestOptions.__retriedAfterRefresh
  ) {
    requestOptions.__retriedAfterRefresh = true;
    await refreshAccessToken();
    response = await sendRequest();
  }

  const responseText = await response.text();
  let data = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }
  }

  if (!response.ok) {
    const responseMessage =
      data.message ||
      data.error ||
      (Array.isArray(data.errors) ? data.errors.join(", ") : data.errors);
    const message =
      typeof responseMessage === "string" && !/^\s*</.test(responseMessage)
        ? responseMessage
        : response.statusText || "The request could not be completed.";
    const error = new Error(message);
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
