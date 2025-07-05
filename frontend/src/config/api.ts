import axios from 'axios';

// API Configuration
const API_CONFIG = {
  // Use environment variable for API URL, fallback to localhost for development
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  TIMEOUT: 10000,
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stored tokens and redirect to login
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('memberships');
      localStorage.removeItem('selectedGroup');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_CONFIG }; 