import axios from 'axios';
import type { ApiError } from '@/types/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const username = parsed?.state?.user?.username;
      if (username) config.headers['username'] = username;
    }
  } catch {
    // ignore
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    const apiError: ApiError = {
      statusCode: data?.statusCode ?? err.response?.status ?? 0,
      message: data?.message ?? err.message ?? 'An unknown error occurred',
    };
    return Promise.reject(apiError);
  },
);
