import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/'
});

// Injeta o token em todas as requisições automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vetcare_access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;