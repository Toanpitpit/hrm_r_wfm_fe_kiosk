/**
 * Danh sách API endpoints chuẩn hóa cho Kiosk Terminal
 */
export const API_ENDPOINTS = {
  // Auth & Kiosk Device Activation
  AUTH: {
    CREATE_CODE: '/kiosk/create-code',
    ACTIVATE_KIOSK: '/kiosk/activate',
    VERIFY_TOKEN: '/kiosk/verify-token',
    UNPAIR: '/kiosk/unpair',
  },
  // Attendance Kiosk 2-Step Endpoints
  ATTENDANCE: {
    VALIDATE_PIN: '/kiosk/attendance/validate-pin',
    ROSTER: '/kiosk/attendance/roster',
    CHECK_IN: '/kiosk/attendance/check-in',
    CHECK_OUT: '/kiosk/attendance/check-out',
    SEARCH_EMPLOYEES: '/kiosk/attendance/search-employees',
    UPLOAD_PHOTO: '/kiosk/attendance/upload-photo',
    PRESIGNED_URL: '/kiosk/attendance/presigned-url',
    // Attendance V3 Endpoints (OTP 60s + Pure Attendance Flow)
    V3_CHECK_IN: '/kiosk/attendance/v3/check-in',
    V3_CHECK_OUT: '/kiosk/attendance/v3/check-out',
    V3_UPLOAD_PHOTO: '/kiosk/attendance/v3/upload-attendance-photo',
    REQUEST_OTP: '/attendance/request-otp',
  },
};

