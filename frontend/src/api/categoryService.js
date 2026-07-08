import api from "./axiosConfig";

// GET /api/categories
export const getCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data;
};

// GET /api/categories/:id
export const getCategory = async (id) => {
  const res = await api.get(`/api/categories/${id}`);
  return res.data;
};