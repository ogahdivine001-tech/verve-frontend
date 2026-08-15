import axios from "axios";

// In local dev, "/api" is handled by Vite's proxy (see vite.config.js) which
// forwards to http://localhost:5000. In production there's no such proxy, so
// VITE_API_URL must be set (e.g. https://your-backend.onrender.com/api) as
// an environment variable in the Vercel project settings.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("verve_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message });
  },
);

export default api;
