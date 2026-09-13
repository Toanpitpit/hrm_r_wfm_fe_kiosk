# 📄 Prompt Template: Tạo Màn Hình Kiosk (Page) Mới

Hãy đóng vai một Frontend Developer chuyên về Kiosk Application & User Experience.
Tạo giúp tôi màn hình Kiosk mới theo yêu cầu bên dưới:

## 📋 Thông tin Task
- **Tên Page**: `[TÊN_PAGE].jsx` (VD: `KioskCheckInPage.jsx`, `StandbyPage.jsx`)
- **Module**: `[TÊN_MODULE]` (VD: `attendance`, `auth`)
- **Tên Route Path**: `[ROUTE_PATH]` (VD: `/checkin`, `/standby`)
- **Mô tả bố cục UI**: `[MÔ_TẢ_GIAO_DIỆN_KIOSK]`

## 📏 Yêu cầu bắt buộc tuân thủ:
1. Giao diện full-screen, tối ưu hiển thị trên màn hình cảm ứng Touchscreen.
2. Tận dụng `ClockHeader` từ `@/shared/components/ClockHeader` ở trên cùng.
3. Sử dụng Tailwind CSS với Dark Theme, Glassmorphism, hiệu ứng chuyển cảnh mượt mà.
4. Tích hợp Service gọi API tương ứng từ `modules/[module]/services/`.
5. Đặt file tại `src/modules/[module]/pages/[TÊN_PAGE].jsx` và đăng ký route trong `src/routers/AppRouter.jsx`.
