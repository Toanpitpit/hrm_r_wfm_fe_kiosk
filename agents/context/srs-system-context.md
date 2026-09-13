# 📚 Shared SRS System Context — Ngữ Cảnh Dự Án R-WFM (Kiosk)

Tài liệu này được trích xuất từ bộ ngữ cảnh chuẩn của dự án tại `docs/context/`.

---

## 1. Tổng Quan Dự Án Kiosk
- **Tên dự án**: Retail Chain Workforce Management Platform (R-WFM) - Phân Hệ Kiosk Điểm Danh.
- **Bối cảnh**: Trạm Kiosk điểm danh đặt tại quầy thu ngân của từng chi nhánh.
- **Cơ chế xác thực Kiosk**: Nhập mã PIN cá nhân 4-6 số, có Server Timestamp và kiểm tra IP mạng nội bộ quầy (`kiosk_allowed_ip`).

## 2. Các Vai Trò Chấm Công Tại Kiosk
1. **Shift Leader (Trưởng ca)**: Check-in/out PIN, giám sát quân số real-time, báo cờ gian lận, ký chốt biên bản giao ca.
2. **Cashier (Thu ngân)**: Check-in PIN + Khai báo tiền lẻ nhận đầu ca (`Opening Float`), kiểm đếm két tiền chốt ca.
3. **Sales Staff (Nhân viên Quầy kệ)**: Check-in/out PIN daily.
4. **Security Guard (Bảo vệ)**: Check-in/out PIN, bàn giao thẻ xe qua đêm & niêm phong kho.
5. **Temporary Dispatched Staff**: Tự động nhận diện tên & mã PIN trên Kiosk chi nhánh mượn từ $D_1 \rightarrow D_2$.

## 3. Nghiệp Vụ Kiosk Chính (Module 3 & Module 5)
- **UC 3.1**: Check-in / Check-out tại Trạm Kiosk với Server Timestamp.
- **UC 3.2**: Khởi tạo phiên thu ngân (`Opening Float Cash`).
- **UC 3.3**: Giám sát quân số thực tế theo thời gian thực.
- **UC 3.4**: Báo cáo ngoại lệ vắng mặt / Gian lận ca.
- **UC 5.1**: Bàn giao két tiền mặt cuối ca (`Cash Handover`).
- **UC 5.2**: Bàn giao an ninh & niêm phong kho (`Security Handover`).
- **UC 5.3**: Trưởng ca ký chốt đóng phiên giao ca.

> Tham khảo chi tiết đầy đủ tại thư mục gốc: `docs/context/`
