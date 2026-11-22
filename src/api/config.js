import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

const rotasPublicas = ['/api/token/', '/api/registro/'];

apiClient.interceptors.request.use((config) => {
  const ehPublica = rotasPublicas.some((r) => config.url?.startsWith(r));
  const token = localStorage.getItem('token');

  if (token && !ehPublica) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const ehPublica = rotasPublicas.some((r) => url.startsWith(r));

    if (error.response?.status === 401 && !ehPublica) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;