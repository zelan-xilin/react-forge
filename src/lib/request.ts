import { store } from '@/store';
import axios, { type AxiosInstance } from 'axios';
import { toast } from 'sonner';

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
});

request.interceptors.request.use(
  config => {
    const token = store.getState().user.token;

    if (token && config.headers) {
      config.headers.Authorization = token;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    toast.error(
      error.response?.data?.message || error.message || '请求出错，请稍后重试',
    );

    return Promise.reject(error);
  },
);

export default request;
