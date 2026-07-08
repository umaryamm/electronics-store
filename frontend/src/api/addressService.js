import api from "./axiosConfig";

// GET /api/addresses
export const getAddresses = async () => {
  const res = await api.get("/api/addresses");
  return res.data;
};

// GET /api/addresses/:type   (type = "shipping" | "billing")
export const getAddressByType = async (type) => {
  const res = await api.get(`/api/addresses/${type}`);
  return res.data;
};

// POST /api/addresses
export const saveAddress = async (data) => {
  // data: { type, fullName, street, city, ... } — match your Prisma Address model
  const res = await api.post("/api/addresses", data);
  return res.data;
};

// DELETE /api/addresses/:type
export const deleteAddress = async (type) => {
  const res = await api.delete(`/api/addresses/${type}`);
  return res.data;
};