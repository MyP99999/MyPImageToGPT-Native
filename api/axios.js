import axios from 'axios';
import { refreshAccessToken } from '../context/useAuth';
// import { isTokenExpired, refreshAccessToken } from '../context/useAuth'; // Correct path

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.9:8080', // Backend base URL
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.log(error)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      // Check if the refreshToken is available and not expired
      if (refreshToken && !isTokenExpired(refreshToken)) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
