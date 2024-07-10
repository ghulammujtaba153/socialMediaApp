import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
});

// Use a request interceptor to add the token from localStorage only in the browser environment
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
}

export default apiClient;
