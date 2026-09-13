# 🤖 Agents — Chuẩn Hóa AI Workflow Cho Team Kiosk

## Mục đích

Thư mục `agents/` là **trung tâm quản lý cách team sử dụng AI** (Gemini, Copilot, ChatGPT,...) trong quá trình phát triển phân hệ **Kiosk điểm danh (`frontend_kiosk`)**.  
Mục tiêu là đảm bảo **mọi thành viên đều sử dụng AI theo cùng một chuẩn Kiosk**, tránh tình trạng code không đồng nhất và hỗ trợ tạo các UI/kịch bản điểm danh chuẩn touch-screen.

---

## Cấu trúc thư mục

```
frontend_kiosk/agents/
├── README.md               ← Bạn đang đọc file này
├── rules/                  ← Quy tắc bắt buộc AI tuân thủ khi sinh code cho Kiosk
│   └── coding-standards.md
├── prompts/                ← Prompt template theo từng loại task Kiosk
│   ├── create-component.md
│   ├── create-service.md
│   ├── create-page.md
│   ├── create-hook.md
│   ├── fix-bug.md
│   └── refactor.md
└── context/                ← Ngữ cảnh dự án Kiosk để AI hiểu codebase
    └── project-overview.md
```

---

## Cách sử dụng

### Bước 1: Đọc quy tắc
Trước khi dùng AI, đọc file `rules/coding-standards.md` để nắm rõ các quy tắc code Kiosk (Touch UI, Tailwind Glassmorphism, Async service, Modal feedback,...).

### Bước 2: Đính kèm context
Copy nội dung từ `context/project-overview.md` và đính kèm vào đầu prompt để AI hiểu codebase `frontend_kiosk`.

### Bước 3: Chọn prompt phù hợp
Vào thư mục `prompts/`, chọn file `.md` tương ứng với task Kiosk bạn đang làm:
- Tạo Kiosk UI component (Bàn phím touch, Modal, Camera scanner,...) → `create-component.md`
- Viết service gọi API Kiosk/Điểm danh → `create-service.md`
- Tạo trang Kiosk mới → `create-page.md`
- Viết custom hook Kiosk (Voice, Audio, Scanner, Clock) → `create-hook.md`
- Fix bug → `fix-bug.md`
- Refactor code → `refactor.md`

### Bước 4: Điền thông tin và gửi cho AI
Thay thế các `[PLACEHOLDER]` trong prompt template bằng thông tin thực tế, rồi gửi cho AI.

---

## Quy tắc quan trọng

> ⚠️ **KHÔNG** tự ý dùng AI mà không tham khảo `rules/coding-standards.md`.  
> ⚠️ **LUÔN** đính kèm `context/project-overview.md` khi bắt đầu session mới với AI.  
> ⚠️ **LUÔN** review lại code do AI sinh ra trước khi commit.
