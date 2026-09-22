import axiosInstance from '@/config/axios.config';
import { API_ENDPOINTS } from '@/config/api.config';
import { KIOSK_MESSAGES } from '@/shared/constants/message.constants';

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
   * [API 1 - S3 Storage] Tải tệp tin ảnh chân dung dạng FormData (multipart/form-data) lên AWS S3 và nhận photoKey
   */
  async uploadPhoto(file, folder = 'attendance/checkin') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.UPLOAD_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải ảnh xác thực lên máy chủ S3.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * [API 2 - S3 Storage] Lấy đường dẫn liên kết xem ảnh tạm thời (Presigned URL) từ photoKey lưu trong CSDL
   */
  async getPresignedUrl(photoKey, expirationMinutes = 30) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ATTENDANCE.PRESIGNED_URL, {
        params: {
          key: photoKey,
          expirationMinutes,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể lấy liên kết xem ảnh chân dung.';
      return {
        success: false,
        message,
      };
    }
  },

  /**
   * Điểm danh Check-in đầu ca làm việc tại trạm Kiosk bằng mã OTP 60s
   */
  async kioskCheckIn(params) {
    return this.kioskCheckInV3(params);
  },

  /**
   * Điểm danh Check-out kết thúc ca làm việc tại trạm Kiosk bằng mã OTP 60s
   */
  async kioskCheckOut(params) {
    return this.kioskCheckOutV3(params);
  },

  /**
   * Upload ảnh xác thực điểm danh
   */
  async uploadAttendancePhoto(params) {
    return this.uploadAttendancePhotoV3(params);
  },

  /**
   * Kịch bản V3 Điểm danh Thuần túy Bước 1: Check-in bằng OTP 60s (Tạo bản ghi PENDING)
   */
  async kioskCheckInV3({ kioskDeviceToken, otpCode }) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.V3_CHECK_IN, {
        kioskDeviceToken,
        otpCode: otpCode.trim(),
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || KIOSK_MESSAGES.INVALID_OTP_CODE;
      console.warn('kioskCheckInV3 API error, fall back to mock data', error);
      return {
        success: false,
        message,
        data: {
          attendanceId: 9999,
          employeeId: 1,
          employeeName: 'Nhân Viên Mẫu (Demo)',
          employeeCode: 'NV001',
          storeName: 'Cửa Hàng Mẫu',
          attendanceLogStatus: 'PENDING',
        },
      };
    }
  },

  /**
   * Kịch bản V3 Điểm danh Thuần túy Bước 1: Check-out bằng OTP 60s (Cập nhật bản ghi PENDING)
   */
  async kioskCheckOutV3({ kioskDeviceToken, otpCode }) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.V3_CHECK_OUT, {
        kioskDeviceToken,
        otpCode: otpCode.trim(),
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || KIOSK_MESSAGES.INVALID_OTP_CODE;
      console.warn('kioskCheckOutV3 API error, fall back to mock data', error);
      return {
        success: false,
        message,
        data: {
          attendanceId: 9999,
          employeeId: 1,
          employeeName: 'Nhân Viên Mẫu (Demo)',
          employeeCode: 'NV001',
          storeName: 'Cửa Hàng Mẫu',
          attendanceLogStatus: 'PENDING',
        },
      };
    }
  },

  /**
   * Kịch bản V3 Điểm danh Thuần túy Bước 2: Upload ảnh xác thực (Chuyển bản ghi sang COMPLETED)
   */
  async uploadAttendancePhotoV3({ kioskDeviceToken, attendanceId, imageBase64, photoType = 'CHECK_IN' }) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.V3_UPLOAD_PHOTO, {
        kioskDeviceToken,
        attendanceId: Number(attendanceId),
        imageBase64,
        photoType,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || KIOSK_MESSAGES.UPLOAD_PHOTO_FAILED;
      console.warn('uploadAttendancePhotoV3 API error, fall back to mock data', error);
      return {
        success: false,
        message,
        data: {
          attendanceId,
          photoKey: `mock/attendance/${attendanceId}.jpg`,
          presignedUrl: imageBase64,
          status: 'COMPLETED',
        },
      };
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

