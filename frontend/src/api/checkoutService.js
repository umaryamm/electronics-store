import api from "./axiosConfig";

export const checkout = async (localCartItems, orderDetails) => {
  await api.delete("/api/cart");

  for (const item of localCartItems) {
    await api.post("/api/cart", { productId: item.id, quantity: item.qty });
  }

  const res = await api.post("/api/orders", orderDetails);
  return res.data;
};