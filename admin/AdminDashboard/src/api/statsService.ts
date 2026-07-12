import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/stats`
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardStats {
  totalProducts: number;
  totalProjectsCount: number;
  totalBlogsCount: number;
  totalOrdersThisMonth: number;
  newOrders24h: number;
  clientQueriesPending: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get('/dashboard');
  return res.data;
};
