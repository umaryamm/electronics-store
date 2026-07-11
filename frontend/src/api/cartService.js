import api from "./axiosConfig";

export const getCart = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

export const addToCart = async (id, type = "product") => {
  const payload = type === "project" ? { projectId: id } : { productId: id };
  const res = await api.post("/api/cart", payload);
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await api.put(`/api/cart/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (itemId) => {
  const res = await api.delete(`/api/cart/${itemId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/api/cart");
  return res.data;
};