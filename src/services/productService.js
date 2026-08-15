import api from "./api";

export const productService = {
  getAll: (params) => api.get("/products", { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
  getById: (id) => api.get(`/products/id/${id}`).then((r) => r.data),
  getRelated: (id) => api.get(`/products/${id}/related`).then((r) => r.data),
  create: (data) => api.post("/products", data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  getLowStock: (threshold) => api.get("/products/admin/low-stock", { params: { threshold } }).then((r) => r.data),
};

export const categoryService = {
  getAll: () => api.get("/categories").then((r) => r.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),
  create: (data) => api.post("/categories", data).then((r) => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
