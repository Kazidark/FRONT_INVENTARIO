import axios from 'axios';
import { AUTH_BASE_URL } from './config';

const authApi = axios.create({
  baseURL: AUTH_BASE_URL
});

authApi.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') ?? 'null');

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default authApi;
