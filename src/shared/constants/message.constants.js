// shared/constants/message.constants.js — Hằng số thông báo hệ thống Kiosk

export const KIOSK_MESSAGES = {
  ENTER_EMPLOYEE_CODE: 'Vui lòng chọn hoặc nhập Mã Nhân Viên.',
  ENTER_FULL_PIN: 'Vui lòng nhập đầy đủ Mã PIN (4-6 chữ số).',
  INVALID_PIN_OR_CODE: 'Mã PIN hoặc Mã Nhân Viên không hợp lệ.',
  ATTENDANCE_NETWORK_ERROR: 'Không thể kết nối máy chủ điểm danh. Vui lòng kiểm tra lại mạng.',
  CHECK_IN_SYSTEM_ERROR: 'Lỗi hệ thống khi điểm danh vào ca.',
  CHECK_OUT_SYSTEM_ERROR: 'Lỗi hệ thống khi điểm danh kết thúc ca.',
  NO_SHIFT_TODAY: (fullName) => `Nhân viên ${fullName} không có lịch phân công ca hôm nay tại chi nhánh này.`,
  ENTER_ACTIVATION_CODE: 'Vui lòng nhập Mã Kích Hoạt Kiosk (OTP) từ Quản lý cửa hàng.',
  INVALID_ACTIVATION_CODE: 'Mã Kích Hoạt Kiosk không chính xác hoặc đã hết hạn.',
  ACTIVATION_NETWORK_ERROR: 'Không thể kết nối đến máy chủ Backend API. Vui lòng kiểm tra lại kết nối mạng.',
};
