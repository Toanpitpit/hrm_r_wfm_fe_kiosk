# 🔌 Prompt Template: Tạo Kiosk Service Call API Mới

Hãy đóng vai một Frontend Developer chuyên về React JS và API Integration.
Viết giúp tôi service gọi API cho Kiosk theo thông tin sau:

## 📋 Thông tin Task
- **Tên Service**: `[TÊN_SERVICE].service.js` (VD: `attendance.service.js`)
- **Phân hệ (Module)**: `[TÊN_MODULE]` (VD: `attendance`, `auth`)
- **Tên hàm API**: `[TÊN_HÀM]` (VD: `checkInByPin`, `getKioskConfig`)
- **Endpoint**: `[HTTP_METHOD] [URL_PATH]` (VD: `POST /attendance/kiosk/check-in-pin`)
- **Payload gửi đi**: `[DỮ_LIỆU_PAYLOAD]`
- **Dữ liệu trả về (Response)**: `[DỮ_LIỆU_RESPONSE]`

## 📏 Yêu cầu bắt buộc tuân thủ:
1. Import và sử dụng `axiosInstance` từ `@/config/axios.config`.
2. Định nghĩa hằng số Endpoint trong `@/config/api.config`.
3. Bọc API call trong try/catch. Cung cấp dữ liệu **Mock Fallback** thông minh trong khối `catch` để phục vụ demo khi Backend chưa sẵn sàng.
4. Lưu file đúng vị trí `src/modules/[module]/services/[service_name].service.js`.
