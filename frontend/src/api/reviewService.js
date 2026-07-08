import api from "./axiosConfig";

// GET /api/products/:productId/reviews
export const getReviews = async (productId) => {
  const res = await api.get(`/api/products/${productId}/reviews`);
  return res.data;
};

// POST /api/products/:productId/reviews  (auth required)
export const createReview = async (productId, data) => {
  // data: { rating, comment }
  const res = await api.post(`/api/products/${productId}/reviews`, data);
  return res.data;
};

// PUT /api/reviews/:id  (auth required — owner only)
export const updateReview = async (id, data) => {
  const res = await api.put(`/api/reviews/${id}`, data);
  return res.data;
};

// DELETE /api/reviews/:id  (auth required — owner only)
export const deleteReview = async (id) => {
  const res = await api.delete(`/api/reviews/${id}`);
  return res.data;
};