import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  addUser: (name) => api.post('/users', { name }),
};

export const claimAPI = {
  claimPoints: (userId) => api.post('/claims/claim', { userId }),
  getHistory: () => api.get('/claims/history'),
  getUserHistory: (userId) => api.get(`/claims/history/${userId}`),
};