import axios from 'axios';
import cookie from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = cookie.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = cookie.get('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh-token', { token: refreshToken });
          cookie.set('token', response.data.token, { path: '/' });
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError);
          cookie.remove('token');
          cookie.remove('refreshToken');
          window.location.href = '/auth/login';
        }
      } else {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
