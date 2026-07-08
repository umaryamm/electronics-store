import api from "./axiosConfig";

// GET /api/products?search=&category=&sort=&minPrice=&maxPrice=
// Pass whatever filters your backend controller supports as a plain object;
// axios turns this into query params automatically.
export const getProducts = async (filters = {}) => {
  const res = await api.get("/api/products", { params: filters });
  return res.data;
};

// GET /api/products/:id
export const getProduct = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};