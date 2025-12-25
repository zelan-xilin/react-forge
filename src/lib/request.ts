import { store } from '@/store';
import axios, { type AxiosInstance } from 'axios';

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token

    if (token && config.headers) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const { data, status } = response;

    if (status === 200) {
      return data.data;
    }

    return Promise.reject(data);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
