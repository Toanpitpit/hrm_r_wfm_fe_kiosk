/**
 * Các thông báo hệ thống Kiosk chuẩn hóa
 */
export const KIOSK_MESSAGES = {
  ENTER_ACTIVATION_CODE: 'Vui lòng nhập mã kích hoạt Kiosk (6 chữ số).',
  INVALID_ACTIVATION_CODE: 'Mã kích hoạt không hợp lệ hoặc đã hết hạn sử dụng.',
  ACTIVATION_NETWORK_ERROR: 'Lỗi kết nối máy chủ khi kích hoạt thiết bị Kiosk.',
  ENTER_EMPLOYEE_CODE: 'Vui lòng nhập hoặc chọn Mã Nhân Viên.',
  ENTER_PIN_CODE: 'Vui lòng nhập mã PIN/OTP 6 số cá nhân.',
  INVALID_PIN_CODE: 'Mã PIN hoặc Mã Nhân Viên không chính xác.',
  ENTER_OTP_CODE: 'Vui lòng nhập đủ 6 chữ số OTP từ ứng dụng di động.',
  INVALID_OTP_CODE: 'Mã OTP không hợp lệ hoặc đã hết hạn (60 giây).',
  CHECKIN_SUCCESS: 'Điểm danh Check-in vào ca thành công!',
  CHECKOUT_SUCCESS: 'Điểm danh Check-out kết thúc ca thành công!',
  CHECKIN_V3_PENDING: 'Xác thực OTP thành công! Vui lòng chụp ảnh khuôn mặt để hoàn tất.',
  CHECKOUT_V3_PENDING: 'Xác thực OTP thành công! Vui lòng chụp ảnh khuôn mặt để hoàn tất.',
  PHOTO_REQUIRED: 'Vui lòng căn chỉnh và chụp ảnh khuôn mặt để hoàn tất điểm danh.',
  UPLOAD_PHOTO_SUCCESS: 'Điểm danh và chụp ảnh xác thực hoàn tất!',
  UPLOAD_PHOTO_FAILED: 'Không thể tải ảnh xác thực lên hệ thống. Vui lòng thử lại.',
  CAMERA_ERROR: 'Không tìm thấy camera hoặc quyền truy cập camera bị từ chối.',
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ điểm danh.',
};

export default KIOSK_MESSAGES;

