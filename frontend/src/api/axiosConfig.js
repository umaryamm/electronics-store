import axios from "axios";

// Single source of truth for the backend URL.
// Set VITE_API_URL=http://localhost:5000 in frontend/.env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
// Runs before every single request. Attaches the JWT if we have one,
// so individual service files never have to think about auth headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// Runs after every response. If the backend says 401 (token missing/expired/invalid),
// we clear the stale session and bounce to login — instead of every page
// having to check for this individually.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirect loop if we're already on the login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;