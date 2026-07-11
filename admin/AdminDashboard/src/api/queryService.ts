import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/queries`
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type QueryStatus = 'Unread' | 'In Progress' | 'Resolved';
export type QueryPriority = 'Low' | 'Medium' | 'High';

export interface ClientQuery {
  id: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  message: string;
  date: string;
  status: QueryStatus;
  priority: QueryPriority;
}

const fromApi = (q: any): ClientQuery => ({
  id: String(q.id),
  clientName: q.clientName,
  clientEmail: q.clientEmail,
  subject: q.subject,
  message: q.message,
  date: (q.createdAt ?? '').slice(0, 16).replace('T', ' '),
  status: q.status,
  priority: q.priority
});

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------
export const getQueries = async (): Promise<ClientQuery[]> => {
  const res = await api.get('/');
  return (res.data.queries || []).map(fromApi);
};

export const updateQueryStatus = async (id: string, status: QueryStatus) => {
  const res = await api.patch(`/${id}`, { status });
  return res.data;
};

export const deleteQuery = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
