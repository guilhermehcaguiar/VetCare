import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000, // Cancela a requisição se o back-end demorar mais de 5 segundos
});

export default api;