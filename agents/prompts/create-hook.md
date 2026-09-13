# 🪝 Prompt Template: Tạo Custom Hook Cho Kiosk

Hãy đóng vai một React Expert. Viết giúp tôi một Custom Hook cho dự án Kiosk theo yêu cầu sau:

## 📋 Thông tin Task
- **Tên Hook**: `use[TÊN_HOOK].js` (VD: `useClock.js`, `useScannerListener.js`, `useAudioFeedback.js`)
- **Mục đích**: `[MÔ_TẢ_MỤC_ĐÍCH]`
- **Dữ liệu đầu vào**: `[THAM_SỐ_ĐẦU_VÀO]`
- **Giá trị trả về**: `[DỮ_LIỆU_TRẢ_VỀ]`

## 📏 Yêu cầu bắt buộc tuân thủ:
1. Viết bằng React Custom Hook chuẩn (dùng `useState`, `useEffect`, `useCallback`, `useRef` nếu cần).
2. Xử lý dọn dẹp bộ nhớ (cleanup effect) khi unmount (VD: `clearInterval`, `removeEventListener`).
3. Nếu là hook dùng chung → Lưu tại `src/shared/hooks/use[TÊN_HOOK].js`.
