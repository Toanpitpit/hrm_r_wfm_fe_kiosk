# 📦 Kiosk Modules Architecture

## Cấu trúc Phân Hệ Nghiệp Vụ cho Kiosk

Thư mục `modules/` trong `frontend_kiosk` tổ chức code độc lập theo phân hệ nghiệp vụ:

```
src/modules/
├── auth/                       ← Kích hoạt & Đăng nhập thiết bị Kiosk cho Cửa Hàng
│   ├── pages/                  ← KioskLoginPage.jsx
│   └── services/               ← auth.service.js
└── attendance/                 ← Điểm danh Kiosk (Mã PIN, Khuôn mặt, Quét mã QR/Thẻ)
    ├── components/
    ├── pages/                  ← KioskCheckInPage.jsx
    └── services/               ← attendance.service.js
```

## Quy tắc
1. Mỗi module độc lập chứa đầy đủ `pages/`, `components/`, `services/`.
2. Không import chéo giữa các module. Component dùng chung đưa vào `src/shared/components/`.
