import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
};

// Skill Swap Request APIs
export const skillSwapAPI = {
  createRequest: async (requestData) => {
    const response = await api.post('/skill-swap-request/', requestData);
    return response.data;
  },

  getRequests: async () => {
    const response = await api.get('/skill-swap-requests/');
    return response.data;
  },
};

export default api;
