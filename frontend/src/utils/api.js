import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Request interceptor — attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hs_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hs_token');
      localStorage.removeItem('hs_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/update-profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  toggleSavedService: (id) => API.post(`/auth/save-service/${id}`),
};

// ─── Services ───
export const servicesAPI = {
  getAll: (params) => API.get('/services', { params }),
  getOne: (id) => API.get(`/services/${id}`),
  getByCategory: (cat) => API.get(`/services/category/${encodeURIComponent(cat)}`),
  getCategories: () => API.get('/services/categories/all'),
  create: (data) => API.post('/services', data),
  update: (id, data) => API.put(`/services/${id}`, data),
  delete: (id) => API.delete(`/services/${id}`),
};

// ─── Bookings ───
export const bookingsAPI = {
  create: (data) => API.post('/bookings', data),
  getMy: (params) => API.get('/bookings/my', { params }),
  getOne: (id) => API.get(`/bookings/${id}`),
  cancel: (id, data) => API.put(`/bookings/${id}/cancel`, data),
  adminGetAll: (params) => API.get('/bookings/admin/all', { params }),
  adminGetStats: () => API.get('/bookings/admin/stats'),
  adminUpdateStatus: (id, data) => API.put(`/bookings/admin/${id}/status`, data),
};

// ─── Reviews ───
export const reviewsAPI = {
  create: (data) => API.post('/reviews', data),
  getForService: (id) => API.get(`/reviews/service/${id}`),
  adminGetAll: () => API.get('/reviews/admin/all'),
  adminToggle: (id) => API.put(`/reviews/admin/${id}/toggle`),
};

// ─── FAQs ───
export const faqsAPI = {
  getAll: (params) => API.get('/faqs', { params }),
  create: (data) => API.post('/faqs', data),
  update: (id, data) => API.put(`/faqs/${id}`, data),
  delete: (id) => API.delete(`/faqs/${id}`),
};

// ─── AI ───
export const aiAPI = {
  getRecommendations: (data) => API.post('/ai/recommend', data),
  chat: (data) => API.post('/ai/chat', data),
  smartSearch: (data) => API.post('/ai/smart-search', data),
};

// ─── Payments ───
export const paymentsAPI = {
  initiate: (data) => API.post('/payments/initiate', data),
  verify: (data) => API.post('/payments/verify', data),
  getHistory: () => API.get('/payments/history'),
};

// ─── Admin ───
export const adminAPI = {
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
  getAnalytics: () => API.get('/admin/analytics'),
};

export default API;
