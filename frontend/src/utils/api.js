import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('solace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('solace_token');
      localStorage.removeItem('solace_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
