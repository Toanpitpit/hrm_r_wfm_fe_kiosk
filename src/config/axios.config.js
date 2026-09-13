import axios from 'axios';

/**
 * Axios Instance chuẩn cho Kiosk Terminal.
 * - Base URL lấy từ biến môi trường VITE_API_URL.
 * - Timeout 10 giây.
 * - Tự động đính kèm Kiosk Terminal Token (nếu đã kích hoạt).
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn Bearer Token của Kiosk Terminal
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kiosk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý các lỗi mạng hoặc Hết hạn phiên
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Kiosk session hết hạn -> xóa token và chuyển tới trang kích hoạt/login Kiosk
      localStorage.removeItem('kiosk_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
