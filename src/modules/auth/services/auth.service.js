import axiosInstance from '@/config/axios.config';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Service xử lý xác thực & kích hoạt Kiosk Terminal bằng Mã Xác Thực ban đầu
 */
export const authService = {
  /**
   * Kích hoạt Kiosk Terminal bằng Mã Activation Code từ Store Manager (VD: POS-1234)
   */
  async activateKiosk(code) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.ACTIVATE_KIOSK, {
        code: code ? code.trim() : '',
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Không thể kích hoạt trạm Kiosk. Vui lòng kiểm tra mã xác thực.';
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  /**
   * Xác minh DeviceToken của Kiosk khi ứng dụng khởi động hoặc Ping định kỳ
   */
  async verifyKioskToken(deviceToken) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, {
        deviceToken,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'DeviceToken không hợp lệ hoặc đã bị vô hiệu hóa.',
      };
    }
  },
};
