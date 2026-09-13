# 🌐 Kiosk Project Overview — Ngữ Cảnh Dự Án Kiosk Cho AI

## Mục đích

File này cung cấp **ngữ cảnh tổng quan chi tiết** về dự án `frontend_kiosk` để AI hiểu đúng codebase ngay từ đầu.  
**Đính kèm nội dung file này** khi bắt đầu một session làm việc mới với AI.

---

## 📌 Thông tin dự án

- **Tên dự án**: SWP391 — Retail Worker Management (Kiosk Terminal Subsystem)
- **Mục đích**: Giao diện thiết bị đầu cuối Kiosk phục vụ **Điểm danh nhân viên** (Check-in / Check-out) tại cửa hàng bằng Mã PIN, Khuôn mặt, hoặc Mã QR.
- **Framework**: React 19 + Vite 6
- **Ngôn ngữ**: JavaScript (JSX / ES6+)
- **Build Tool**: Vite (Port 3001)
- **Styling**: Tailwind CSS v3 + Custom Kiosk Theme (Dark Mode High-Contrast, Glassmorphism)
- **State Management**: React Context (`KioskContext.jsx`) + Custom Hooks (`useClock.js`)
- **HTTP Client**: Axios với Interceptors (`axios.config.js`)
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: React Router DOM v7 (`AppRouter.jsx`)
- **Kiến trúc**: Modular Architecture (Phân hệ độc lập)

---

## 📂 Cấu trúc thư mục (Modular Architecture)

```
frontend_kiosk/
├── agents/                          🤖 AI Prompts, Context & Rules cho team Kiosk
│   ├── rules/coding-standards.md    Quy tắc sinh code Kiosk
│   ├── prompts/                     Prompt templates theo từng loại task
│   └── context/project-overview.md  ← File này
│
├── public/                          Assets tĩnh (Âm thanh thông báo, Logo, Wallpapers)
├── src/
│   ├── config/                      ⚙️ Cấu hình Kiosk & Axios Instance
│   │   ├── axios.config.js          BaseURL, Interceptor gắn Bearer Token, 401 redirect
│   │   └── api.config.js            Danh sách API Endpoints
│   │
│   ├── shared/                      🔗 Linh kiện & tiện ích dùng chung
│   │   ├── components/              ClockHeader, PinKeypad, AttendanceModal,...
│   │   ├── constants/               storage.js, routes.js
│   │   ├── context/                 KioskContext.jsx (Store Info, Online status, Token)
│   │   ├── hooks/                   useClock.js, useAudioFeedback.js
│   │   └── utils/                   format.js, sound.js
│   │
│   ├── modules/                     📦 PHÂN HỆ NGHIỆP VỤ KIOSK
│   │   ├── auth/                    Phân hệ kích hoạt & đăng nhập Kiosk theo cửa hàng
│   │   │   ├── pages/               KioskLoginPage.jsx
│   │   │   └── services/            auth.service.js
│   │   │
│   │   └── attendance/              Phân hệ điểm danh Kiosk
│   │       ├── components/          CameraPreview.jsx, PinPadModal.jsx
│   │       ├── pages/               KioskCheckInPage.jsx (Màn hình chính Kiosk)
│   │       └── services/            attendance.service.js
│   │
│   ├── routers/                     🛤️ React Router DOM & Kiosk Guard
│   │   └── AppRouter.jsx
│   │
│   ├── styles/                      🎨 Global CSS & Kiosk Design Tokens
│   │   └── index.css                Tailwind Directives & Glassmorphism classes
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.development / .env.production
├── index.html                       Tối ưu viewport cho màn hình cảm ứng Touchscreen
├── package.json
├── tailwind.config.js
└── vite.config.js                   Cấu hình Alias `@/` trỏ tới `./src`
```

---

## 📐 Quy Tắc Kiến Trúc & Code Conventions

### 1. Quy tắc Modular Architecture
- **Mỗi module trong `src/modules/` là một đơn vị độc lập** chứa `pages/`, `components/`, `services/` riêng.
- **Không import chéo giữa các module** (Ví dụ: `attendance` không import trực tiếp từ `auth`).
- Nếu 2 module cần xài chung component/utility → Đưa vào `src/shared/`.

### 2. Thiết kế Giao diện Touchscreen Kiosk (UI/UX)
- Màn hình Kiosk là màn hình cảm ứng đặt tại cửa hàng, cần thiết kế **to, rõ, màu tương phản cao (High-contrast Dark mode)**.
- Tất cả nút bấm đều phải có kích thước lớn (chiều cao tối thiểu `h-14` hoặc `h-16`), phản hồi hiệu ứng `active:scale-95` để người dùng cảm nhận được thao tác chạm.
- Tận dụng lớp CSS `.kiosk-glass` và `.kiosk-glass-card` cho bề mặt mờ nhám hiện đại.

### 3. Quy ước đặt tên
- **Components / Pages**: PascalCase → `PinKeypad.jsx`, `KioskCheckInPage.jsx`
- **Services**: camelCase + `.service.js` → `attendance.service.js`, `auth.service.js`
- **Hooks**: prefix `use` → `useClock.js`
- **Context**: PascalCase + `Context.jsx` → `KioskContext.jsx`
- **Import Path**: Luôn sử dụng Alias `@/` thay vì relative path dài (`../../shared`).

### 4. Quy trình triển khai tính năng mới trong Module Kiosk
```
1️⃣ shared/constants/routes.js & storage.js → Thêm hằng số nếu cần
2️⃣ config/api.config.js                    → Khai báo API Endpoint
3️⃣ modules/[tên_module]/services/          → Viết API service call
4️⃣ shared/components/                      → Tạo component UI dùng chung (nếu có)
5️⃣ modules/[tên_module]/pages/             → Dựng trang Kiosk
6️⃣ routers/AppRouter.jsx                   → Đăng ký Route trong AppRouter
```

---

## 🔌 API & Integration Guidelines

- API Service phải dùng `axiosInstance` từ `@/config/axios.config`.
- Luôn bọc API call trong try/catch.
- Nếu Backend API chưa sẵn sàng, viết sẵn dữ liệu **Mock Fallback** thông minh trong khối `catch` để Kiosk luôn hiển thị mượt mà trên giao diện demo.
