import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const key = localStorage.getItem('authdna_api_key');
  if (key) {
    console.log(`📤 Adding X-API-Key header: ${key.substring(0, 20)}...`);
    config.headers['X-API-Key'] = key;
  } else {
    console.warn('⚠️  No API key in localStorage');
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authdna_api_key');
      if (window.location.pathname.startsWith('/app')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;