import api from "./axiosConfig";

// All of these require auth — the axios interceptor attaches the token,
// so no extra work needed here as long as the user is logged in.

// GET /api/cart
export const getCart = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

// POST /api/cart
export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post("/api/cart", { productId, quantity });
  return res.data;
};

// PUT /api/cart/:itemId
export const updateCartItem = async (itemId, quantity) => {
  const res = await api.put(`/api/cart/${itemId}`, { quantity });
  return res.data;
};

// DELETE /api/cart/:itemId
export const removeCartItem = async (itemId) => {
  const res = await api.delete(`/api/cart/${itemId}`);
  return res.data;
};

// DELETE /api/cart (clear entire cart)
export const clearCart = async () => {
  const res = await api.delete("/api/cart");
  return res.data;
};