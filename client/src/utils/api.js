import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://company-registry1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Company API
export const companyApi = {
  register: (companyData) => api.post('/companies', companyData),
  getAll: (params = {}) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  search: (query) => api.get('/companies/search', { params: { q: query } }),
};

// Geocoding API - Now calling our backend endpoint
export const geocodeApi = {
  forward: async (query) => {
    try {
      const response = await api.get('/geocode/forward', {
        params: { q: query },
        headers: {
          'User-Agent': 'CompanyRegistryApp/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to mock data
      return [
        { display: `${query}, New Delhi, India`, lat: 28.6139, lng: 77.2090 },
        { display: `${query}, Delhi, India`, lat: 28.7041, lng: 77.1025 }
      ];
    }
  },
  reverse: async (lat, lng) => {
    try {
      const response = await api.get('/geocode/reverse', {
        params: { lat, lng },
        headers: {
          'User-Agent': 'CompanyRegistryApp/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  }
};

// Cache utility
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cachedApiCall = async (key, apiCall) => {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await apiCall();
  cache.set(key, { data, timestamp: now });
  return data;
};

// Utility: Format coordinates for display
export const formatCoordinates = (coords) => {
  if (!coords) return '';
  return `Lat: ${coords.lat?.toFixed(6)}, Lng: ${coords.lng?.toFixed(6)}`;
};
