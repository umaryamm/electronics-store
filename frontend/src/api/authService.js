import api from "./axiosConfig";

// POST /api/auth/signup
export const signup = async (data) => {
  // data: { name, email, password }
  const res = await api.post("/api/auth/signup", data);
  return res.data;
};

// POST /api/auth/login
// Backend returns { token, user }. We store both here so AuthContext
// and axiosConfig's interceptor can read them from localStorage.
export const login = async (data) => {
  // data: { email, password }
  const res = await api.post("/api/auth/login", data);
  const { token, user } = res.data;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getStoredToken = () => localStorage.getItem("token");
export const getMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

export const updateMe = async (data) => {
  const res = await api.put("/api/auth/me", data);
  return res.data;
};