import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("verve_token") || null,
  isLoading: true,
  isAuthenticated: false,

  init: async () => {
    const token = localStorage.getItem("verve_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await authService.getMe();
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("verve_token");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem("verve_token", res.data.token);
    set({ user: res.data.user, token: res.data.token, isAuthenticated: true });
    return res.data.user;
  },

  register: async (data) => {
    const res = await authService.register(data);
    localStorage.setItem("verve_token", res.data.token);
    set({ user: res.data.user, token: res.data.token, isAuthenticated: true });
    return res.data.user;
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout; clear local state regardless
    }
    localStorage.removeItem("verve_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => set({ user }),

  isAdmin: () => get().user?.role === "admin",
}));
