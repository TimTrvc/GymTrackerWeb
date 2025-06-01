import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Axios instance with default configuration for API requests.
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Adds Authorization token to request headers if available.
 * @param {import('axios').AxiosRequestConfig} config - Axios request configuration.
 * @returns {import('axios').AxiosRequestConfig} Modified config with Authorization header if token exists.
 */
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

export default api;
