# 📖 Tài Liệu Kiosk API Docs — R-WFM Kiosk Terminal System

Tài liệu này tóm tắt các tính năng của phân hệ **Kiosk Điểm Danh Quầy (`frontend_kiosk`)** và mô tả chi tiết danh sách API endpoints backend .NET 8 C# được tổ chức chuẩn hóa theo cụm route `/api/kiosk/` và `/api/kiosk/attendance/`.

---

## 🎯 1. Tóm Tắt Tính Năng Sản Phẩm Kiosk

1. **Kích Hoạt Trạm Kiosk 2 Bước (`KioskLoginPage`)**:
   - Store Manager mở web quản trị -> Gọi API `POST /api/kiosk/create-code` -> Nhận mã OTP 6 ký tự (VD: `POS-4421`, hiệu lực 15 phút).
   - Nhân viên tại trạm Kiosk mở ứng dụng -> Nhập mã OTP `POS-4421` -> Gọi API `POST /api/kiosk/activate` -> Trả về `DeviceToken` định danh trạm Kiosk.
2. **Xác Thực Mã PIN 2 Bước (`KioskCheckInPage`)**:
   - **Bước 1**: Nhập hoặc chọn **Mã Nhân Viên** (VD: `CSH001`) và **Mã PIN** -> Gọi API `POST /api/kiosk/attendance/validate-pin`.
   - **Bước 2**: Backend kiểm tra mã PIN, kiểm tra lịch ca trực hôm nay và hiển thị form chọn Check-In / Check-Out.
3. **Vòng Lặp Chấm Công Vô Tận (Endless Loop)**:
   - Hiển thị Modal phản hồi kết quả điểm danh (Thành công / Thất bại, Họ tên, Mã NV, Thời gian server).
   - Tự động đếm ngược **3 giây** và reset về Bước 1 sẵn sàng cho nhân viên tiếp theo.

---

## 🔌 2. Chi Tiết Backend API Specifications & JSON Samples (Route `/api/kiosk/...`)

### 🔑 API 1: Store Manager Sinh Mã Ghép Nối Kiosk
- **Endpoint**: `POST /api/kiosk/create-code`
- **Quyền**: Authorize (`StoreManager`, `OperationsAdmin`, `BusinessOwner`)
- **Request Body**:
```json
{
  "storeId": 1,
  "kioskName": "Máy POS Quầy Số 2"
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Tạo mã ghép nối Kiosk thành công. Mã có hiệu lực trong 15 phút.",
  "data": {
    "activationCodeId": 1,
    "storeId": 1,
    "kioskName": "Máy POS Quầy Số 2",
    "code": "POS-4421",
    "expiresAt": "2026-09-12T18:00:00Z",
    "isUsed": false
  },
  "errors": null,
  "timestamp": "2026-09-12T17:45:00Z"
}
```

---

### 🔑 API 2: Trạm Kiosk Nhập Mã Ghép Nối & Kích Hoạt
- **Endpoint**: `POST /api/kiosk/activate`
- **Quyền**: Public / AllowAnonymous
- **Request Body**:
```json
{
  "code": "POS-4421"
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Kích hoạt trạm Kiosk thành công!",
  "data": {
    "kioskId": 1,
    "storeId": 1,
    "storeCode": "ST001",
    "storeName": "Chi nhánh Nguyễn Trãi",
    "kioskCode": "CH01-POS02",
    "kioskName": "Máy POS Quầy Số 2",
    "deviceToken": "ksk_tok_9a8b7c6d5e4f3a2b1c",
    "status": "Active",
    "activatedAt": "2026-09-12T17:46:00Z"
  },
  "errors": null,
  "timestamp": "2026-09-12T17:46:00Z"
}
```

---

### 💓 API 3: Trạm Kiosk Xác Thực DeviceToken (Auto-login / Ping)
- **Endpoint**: `POST /api/kiosk/verify-token`
- **Quyền**: Public / AllowAnonymous
- **Request Body**:
```json
{
  "deviceToken": "ksk_tok_9a8b7c6d5e4f3a2b1c"
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Thiết bị Kiosk hợp lệ.",
  "data": {
    "kioskId": 1,
    "storeId": 1,
    "storeCode": "ST001",
    "storeName": "Chi nhánh Nguyễn Trãi",
    "kioskCode": "CH01-POS02",
    "kioskName": "Máy POS Quầy Số 2",
    "status": "Active"
  },
  "errors": null,
  "timestamp": "2026-09-12T17:46:00Z"
}
```

---

### 👤 API 4: Xác Thực Mã PIN Nhân Viên 2 Bước
- **Endpoint**: `POST /api/kiosk/attendance/validate-pin`
- **Quyền**: Public / AllowAnonymous
- **Request Body**:
```json
{
  "storeId": 1,
  "employeeCode": "CSH001",
  "pinCode": "1234"
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Xác thực mã PIN nhân viên thành công.",
  "data": {
    "employeeId": 3,
    "employeeCode": "CSH001",
    "fullName": "Đỗ Hoàng Ngân",
    "positionName": "Thu ngân",
    "positionCode": "CASHIER",
    "primaryStoreId": 1,
    "isValid": true,
    "hasShiftToday": true,
    "assignmentId": 2,
    "shiftName": "Ca sáng (08:00 - 14:00)",
    "hasCheckedIn": false,
    "hasCheckedOut": false
  },
  "errors": null,
  "timestamp": "2026-09-12T17:46:00Z"
}
```

---

### 📋 API 5: Lấy Danh Sách Quân Số Ca Trực Kiosk (Roster)
- **Endpoint**: `GET /api/kiosk/attendance/roster?storeId=1&date=2026-09-12`
- **Quyền**: Public / AllowAnonymous
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Lấy danh sách ca trực thành công.",
  "data": [
    {
      "employeeId": 3,
      "employeeCode": "CSH001",
      "fullName": "Đỗ Hoàng Ngân",
      "positionName": "Thu ngân",
      "assignmentId": 2,
      "shiftName": "Ca sáng (08:00 - 14:00)",
      "startTime": "08:00:00",
      "endTime": "14:00:00",
      "hasCheckedIn": true,
      "hasCheckedOut": false,
      "checkInTime": "2026-09-12T07:58:12Z",
      "checkOutTime": null,
      "isDispatched": false
    }
  ],
  "errors": null,
  "timestamp": "2026-09-12T17:46:00Z"
}
```

---

### 📥 API 6: Check-In Điểm Danh Kiosk
- **Endpoint**: `POST /api/kiosk/attendance/check-in`
- **Request Body**:
```json
{
  "employeeId": 3,
  "pinCode": "1234",
  "storeId": 1,
  "kioskId": 1,
  "openingFloatCash": 500000.00
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Check-in thành công lúc 07:58:12!",
  "data": {
    "attendanceId": 1,
    "assignmentId": 2,
    "employeeId": 3,
    "employeeName": "Đỗ Hoàng Ngân",
    "employeeCode": "CSH001",
    "storeId": 1,
    "kioskId": 1,
    "storeName": "Chi nhánh Nguyễn Trãi",
    "checkInTime": "2026-09-12T07:58:12Z",
    "checkInMethod": "Kiosk",
    "status": "Present"
  },
  "errors": null,
  "timestamp": "2026-09-12T17:46:00Z"
}
```

---

### 📤 API 7: Check-Out Điểm Danh Kiosk
- **Endpoint**: `POST /api/kiosk/attendance/check-out`
- **Request Body**:
```json
{
  "employeeId": 3,
  "pinCode": "1234",
  "storeId": 1,
  "kioskId": 1
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Check-out thành công lúc 14:02:10. Hẹn gặp lại bạn!",
  "data": {
    "attendanceId": 1,
    "assignmentId": 2,
    "employeeId": 3,
    "employeeName": "Đỗ Hoàng Ngân",
    "employeeCode": "CSH001",
    "storeId": 1,
    "kioskId": 1,
    "storeName": "Chi nhánh Nguyễn Trãi",
    "checkInTime": "2026-09-12T07:58:12Z",
    "checkOutTime": "2026-09-12T14:02:10Z",
    "checkInMethod": "Kiosk",
    "checkOutMethod": "Kiosk",
    "status": "Completed"
  },
  "errors": null,
  "timestamp": "2026-09-12T17:46:00Z"
}
```

---

## 🧪 3. cURL Command Samples

### Test API Kích Hoạt Kiosk:
```bash
curl -X POST http://localhost:5050/api/kiosk/activate \
  -H "Content-Type: application/json" \
  -d '{"code": "POS-4421"}'
```

### Test API Xác Thực PIN Nhân Viên:
```bash
curl -X POST http://localhost:5050/api/kiosk/attendance/validate-pin \
  -H "Content-Type: application/json" \
  -d '{"storeId": 1, "employeeCode": "CSH001", "pinCode": "1234"}'
```
