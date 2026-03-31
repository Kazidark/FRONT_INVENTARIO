import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') ?? 'null');

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  // Traza simple del request (no imprime token ni password)
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  const method = String(config.method ?? 'get').toUpperCase();
  // console.log('[FRONT][HTTP][REQ]', method, url);

  return config;
});

api.interceptors.response.use(
  (response) => {
    const url = `${response.config?.baseURL ?? ''}${response.config?.url ?? ''}`;
    const method = String(response.config?.method ?? 'get').toUpperCase();
    // console.log('[FRONT][HTTP][RES]', method, url, 'status:', response.status);
    return response;
  },
  (error) => {
    const cfg = error?.config;
    const url = `${cfg?.baseURL ?? ''}${cfg?.url ?? ''}`;
    const method = String(cfg?.method ?? 'get').toUpperCase();
    const status = error?.response?.status;
    // console.log('[FRONT][HTTP][ERR]', method, url, 'status:', status ?? 'NO_RESPONSE');
    return Promise.reject(error);
  },
);

export default api;
