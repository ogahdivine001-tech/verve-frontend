import api from "./api";

export const cartService = {
  get: () => api.get("/cart").then((r) => r.data),
  add: (data) => api.post("/cart", data).then((r) => r.data),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }).then((r) => r.data),
  remove: (itemId) => api.delete(`/cart/${itemId}`).then((r) => r.data),
  clear: () => api.delete("/cart").then((r) => r.data),
  merge: (items) => api.post("/cart/merge", { items }).then((r) => r.data),
};

export const wishlistService = {
  get: () => api.get("/wishlist").then((r) => r.data),
  add: (productId) => api.post("/wishlist", { productId }).then((r) => r.data),
  remove: (productId) => api.delete(`/wishlist/${productId}`).then((r) => r.data),
  moveToCart: (productId) => api.post(`/wishlist/${productId}/move-to-cart`).then((r) => r.data),
};

export const orderService = {
  getMine: (params) => api.get("/orders", { params }).then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  getAll: (params) => api.get("/orders/admin/all", { params }).then((r) => r.data),
  updateStatus: (id, orderStatus, userEmail) =>
    api.put(`/orders/${id}/status`, { orderStatus, userEmail }).then((r) => r.data),
  cancel: (id) => api.put(`/orders/${id}/cancel`).then((r) => r.data),
};

export const paymentService = {
  initialize: (data) => api.post("/payments/initialize", data).then((r) => r.data),
  verify: (reference) => api.get(`/payments/verify/${reference}`).then((r) => r.data),
};

export const reviewService = {
  getForProduct: (productId) => api.get(`/reviews/product/${productId}`).then((r) => r.data),
  create: (data) => api.post("/reviews", data).then((r) => r.data),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`).then((r) => r.data),
  getAll: (params) => api.get("/reviews/admin/all", { params }).then((r) => r.data),
  moderate: (id, status) => api.put(`/reviews/${id}/moderate`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/reviews/${id}`).then((r) => r.data),
};

export const couponService = {
  validate: (code, subtotal) => api.post("/coupons/validate", { code, subtotal }).then((r) => r.data),
  getAll: () => api.get("/coupons").then((r) => r.data),
  create: (data) => api.post("/coupons", data).then((r) => r.data),
  update: (id, data) => api.put(`/coupons/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/coupons/${id}`).then((r) => r.data),
};

export const notificationService = {
  getMine: () => api.get("/notifications").then((r) => r.data),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.put("/notifications/read-all").then((r) => r.data),
  broadcast: (data) => api.post("/notifications/broadcast", data).then((r) => r.data),
};

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/uploads/image", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    return api.post("/uploads/images", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
  deleteImage: (publicId) => api.delete("/uploads", { data: { publicId } }).then((r) => r.data),
};

export const analyticsService = {
  getOverview: (range) => api.get("/admin/analytics/overview", { params: { range } }).then((r) => r.data),
  getRevenueChart: (range) => api.get("/admin/analytics/revenue-chart", { params: { range } }).then((r) => r.data),
  getTopProducts: (range) => api.get("/admin/analytics/top-products", { params: { range } }).then((r) => r.data),
  getCategoryBreakdown: () => api.get("/admin/analytics/category-breakdown").then((r) => r.data),
  getCustomerGrowth: (range) => api.get("/admin/analytics/customer-growth", { params: { range } }).then((r) => r.data),
};

export const userService = {
  updateProfile: (data) => api.put("/users/profile", data).then((r) => r.data),
  getAddresses: () => api.get("/users/addresses").then((r) => r.data),
  addAddress: (data) => api.post("/users/addresses", data).then((r) => r.data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data).then((r) => r.data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`).then((r) => r.data),
  getAll: (params) => api.get("/users", { params }).then((r) => r.data),
  getById: (id) => api.get(`/users/${id}`).then((r) => r.data),
  toggleStatus: (id) => api.put(`/users/${id}/status`).then((r) => r.data),
  changeRole: (id, role) => api.put(`/users/${id}/role`, { role }).then((r) => r.data),
};
