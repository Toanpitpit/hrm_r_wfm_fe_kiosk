# 🎨 Prompt Template: Tạo Kiosk UI Component Mới

Hãy đóng vai một Frontend Developer chuyên về React JS và thiết kế giao diện Kiosk Touchscreen.
Tạo giúp tôi component Kiosk theo yêu cầu bên dưới:

## 📋 Thông tin Task
- **Tên Component**: `[TÊN_COMPONENT]` (VD: `CameraScanner`, `KeypadModal`, `ShiftStatusBadge`)
- **Loại Component**: `[Shared / Module specific]`
- **Module tương ứng** (nếu có): `[TÊN_MODULE]` (VD: `attendance`, `auth`)
- **Mô tả chức năng**: `[MÔ_TẢ_CHỨC_NĂNG]`
- **Props nhận vào**: `[DANH_SÁCH_PROPS]`

## 📏 Yêu cầu bắt buộc tuân thủ:
1. Viết bằng **React JS (JSX)**, dùng Functional Component.
2. Dùng **Tailwind CSS** với phong cách Kiosk Dark Theme (`bg-slate-900`, `.kiosk-glass-card`, `active:scale-95`).
3. Các phần tử bấm/chạm phải to, dễ tương tác trên màn hình cảm ứng Kiosk (chiều cao tối thiểu `h-12`).
4. Icon lấy từ `lucide-react`.
5. Đặt đúng vị trí thư mục theo Modular Architecture (nếu shared -> `src/shared/components/`, nếu module -> `src/modules/[module]/components/`).
