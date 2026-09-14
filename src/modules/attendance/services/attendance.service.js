import axiosInstance from '@/config/axios.config';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Service xử lý điểm danh Kiosk 2 bước chuẩn hóa với Backend API
 */
export const attendanceService = {
  /**
   * Bước 1: Tra cứu & Xác thực PIN Nhân viên (Trả về thông tin ca làm việc hôm nay)
   */
  async validatePin(storeId, employeeCode, pinCode) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.VALIDATE_PIN, {
        storeId: Number(storeId),
        employeeCode: employeeCode.trim(),
        pinCode: pinCode.trim(),
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Mã PIN hoặc Mã Nhân Viên không chính xác.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * Bước 2a: Thực hiện Check-in đầu ca làm việc bằng mã PIN tại trạm Kiosk
   */
  async kioskCheckIn({ employeeId, storeId, pinCode, kioskId, openingFloatCash }) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, {
        employeeId,
        storeId: Number(storeId),
        pinCode: pinCode.trim(),
        kioskId: kioskId ? Number(kioskId) : null,
        openingFloatCash: openingFloatCash ? Number(openingFloatCash) : null,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể thực hiện Check-in điểm danh.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * Bước 2b: Thực hiện Check-out kết thúc ca làm việc bằng mã PIN tại trạm Kiosk
   */
  async kioskCheckOut({ employeeId, storeId, pinCode, kioskId }) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT, {
        employeeId,
        storeId: Number(storeId),
        pinCode: pinCode.trim(),
        kioskId: kioskId ? Number(kioskId) : null,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể thực hiện Check-out điểm danh.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * Kịch bản V3 Điểm danh Thuần túy: Check-in bằng OTP 60s + Ảnh chân dung S3
   */
  async kioskCheckInV3({ kioskDeviceToken, userId, otpCode, imageBase64 }) {
    try {
      const response = await axiosInstance.post('kiosk/attendance/v3/check-in', {
        kioskDeviceToken,
        userId: Number(userId),
        otpCode: otpCode.trim(),
        imageBase64,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể thực hiện Check-in V3.';
      return { success: false, message };
    }
  },

  /**
   * Kịch bản V3 Điểm danh Thuần túy: Check-out bằng OTP 60s + Ảnh chân dung S3
   */
  async kioskCheckOutV3({ kioskDeviceToken, userId, otpCode, imageBase64 }) {
    try {
      const response = await axiosInstance.post('kiosk/attendance/v3/check-out', {
        kioskDeviceToken,
        userId: Number(userId),
        otpCode: otpCode.trim(),
        imageBase64,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể thực hiện Check-out V3.';
      return { success: false, message };
    }
  },

  /**
   * Lấy danh sách phân công quân số ca trực hôm nay tại cửa hàng
   */
  async getKioskRoster(storeId, date) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ATTENDANCE.ROSTER, {
        params: { storeId, date },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Không thể lấy danh sách ca trực.',
        data: [],
      };
    }
  },

  /**
   * Tra cứu gợi ý danh sách nhân viên chi nhánh theo từ khóa mã/tên
   */
  async searchStoreEmployees(storeId, query) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ATTENDANCE.SEARCH_EMPLOYEES, {
        params: { storeId: Number(storeId), query: query ? query.trim() : '' },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tìm kiếm nhân viên.',
        data: [],
      };
    }
  },

  /**
   * Đệ trình GPS di động và lấy mã OTP 60s trên điện thoại cá nhân nhân viên
   */
  async requestOtp(latitude, longitude, type = 'CHECK_IN') {
    try {
      const response = await axiosInstance.post('attendance/request-otp', {
        latitude,
        longitude,
        type,
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Không thể kết nối đến hệ thống lấy OTP.' };
    }
  },
};

