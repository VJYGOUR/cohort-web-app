import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔑 required for cookies
});

let isRefreshing = false;
let queue: Array<(value?: unknown) => void> = [];

const AUTH_EXCLUDE_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/me",
  "/auth/refresh-token",
];
//interceptor=checkpoint
//config is the blueprint of the request that just failed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean; url?: string };

    const requestUrl = originalRequest.url ?? "";

    // Skip refresh logic for auth routes
    if (AUTH_EXCLUDE_ROUTES.some((route) => requestUrl.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh-token");
        queue.forEach((cb) => cb());
        queue = [];
        return api(originalRequest);
      } catch {
        queue = [];
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
