import api from "./axiosConfig";

// POST /api/queries (public — no auth required)
export const submitQuery = async ({ clientName, clientEmail, subject, message }) => {
  const res = await api.post("/api/queries", { clientName, clientEmail, subject, message });
  return res.data;
};
