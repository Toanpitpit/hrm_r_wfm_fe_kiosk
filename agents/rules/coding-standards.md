# 📏 Coding Standards — Quy Tắc Sinh Code Cho AI (Kiosk Terminal)

AI **bắt buộc tuân thủ** các quy tắc dưới đây khi tạo hoặc chỉnh sửa code trong dự án `frontend_kiosk`.

---

## 1. Quy tắc Cấu Trúc & Ngôn Ngữ
- Ngôn ngữ: **JavaScript (React 19, JSX, ES6+)**.
- Mọi import nội bộ trong dự án phải dùng Path Alias **`@/`** (Ví dụ: `import { useKiosk } from '@/shared/context/KioskContext'`).
- Không tạo file TypeScript (`.ts` / `.tsx`) trừ khi được yêu cầu cụ thể.

---

## 2. Quy tắc Modular Architecture
- Code nghiệp vụ thuộc về module nào phải nằm trong `src/modules/[tên_module]/`.
- **TUYỆT ĐỐI KHÔNG import chéo** giữa các module khác nhau.
- Nếu cần chia sẻ linh kiện giữa các module → Đưa linh kiện đó vào `src/shared/components/` hoặc `src/shared/hooks/`.

---

## 3. Quy tắc Thiết Kế Giao Diện Kiosk (Touchscreen UI)
- Giao diện Kiosk chạy trên màn hình touch 1080p+, cần đạt các tiêu chí:
  1. **Tap Target lớn**: Kích thước nút tối thiểu `h-14` hoặc `h-16`, padding rộng rãi.
  2. **Touch Feedback**: Có hiệu ứng khi chạm (`active:scale-95`, `transition-all`).
  3. **High Contrast Dark Mode**: Màu nền tối (`bg-slate-950`), chữ sáng (`text-white`, `text-slate-300`), màu nhấn neon rõ ràng (`blue-500`, `emerald-400`, `red-400`).
  4. **Glassmorphism Style**: Sử dụng lớp CSS `.kiosk-glass` và `.kiosk-glass-card`.
  5. **Không dùng hover thuần**: Màn hình cảm ứng không có con trỏ chuột, ưu tiên trạng thái `active:` và nút kích thước rõ ràng.

---

## 4. Quy tắc Viết Service & API Call
- Mọi API Service đều khai báo dưới dạng object export trong `services/[module].service.js`:
  ```javascript
  import axiosInstance from '@/config/axios.config';
  import { API_ENDPOINTS } from '@/config/api.config';

  export const attendanceService = {
    async checkInByPin(pinCode) {
      try {
        const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN_PIN, { pinCode });
        return response.data;
      } catch (error) {
        console.warn('API error, fall back to mock data', error);
        return { success: true, message: 'Mock data' };
      }
    }
  };
  ```
- Luôn có khối `try...catch` và sẵn sàng **Mock Data** trong khối `catch` để phục vụ demo khi API chưa sẵn sàng.

---

## 5. Quy tắc Viết React Components
- Dùng Functional Components với Arrow Functions hoặc standard function declaration.
- Destructure props ở tham số truyền vào với default values.
- Mọi component có tương tác API phải có trạng thái `loading` và hiển thị spinner/indicator rõ ràng.
- Icon sử dụng duy nhất từ thư viện `lucide-react`.

---

## 6. Quy tắc Routing
- Mọi Route đăng ký trong `src/routers/AppRouter.jsx`.
- Đường dẫn Route khai báo tập trung trong `src/shared/constants/routes.js`.
- Trang Kiosk cần đăng nhập/kích hoạt phải bọc qua `KioskGuard`.
