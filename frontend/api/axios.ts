import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

// --- Request Interceptor ---
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response Interceptor (Token Refresh) ---
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;

      if (!refresh) return Promise.reject(err);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/refresh`,
          { refresh_token: refresh }
        );

        localStorage.setItem("access_token", res.data.access_token);

        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (e) {
        console.error("Refresh token expired", e);
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
