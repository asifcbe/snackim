import axios from 'axios';

export const STORAGE_KEY = 'snackimUser';
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = /\/api\/auth\/(login|register)/.test(err.config?.url || '');
    if (err.response?.status === 401 && !isAuthCall && localStorage.getItem(STORAGE_KEY)) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Uploaded media is stored as a relative /uploads/... path; absolute URLs pass through.
export const mediaUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const errMsg = (err, fallback = 'Something went wrong') => err?.response?.data?.message || fallback;

export const rupee = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

export default api;
