import api from "./axiosConfig";

// POST /api/orders — this is the checkout submission
export const createOrder = async (data) => {
  // data: { shippingAddressId, shippingMethod, shippingCost, paymentMethod }
  const res = await api.post("/api/orders", data);
  return res.data;
};

// GET /api/orders/my — customer's own order list
export const getMyOrders = async () => {
  const res = await api.get("/api/orders/my");
  return res.data;
};

// GET /api/orders/my/:id — single order detail / tracking page
export const getMyOrder = async (id) => {
  const res = await api.get(`/api/orders/my/${id}`);
  return res.data;
};