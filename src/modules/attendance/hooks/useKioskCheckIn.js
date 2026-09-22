import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendance.service';
import { useKiosk } from '@/shared/context/KioskContext';
import { KIOSK_MESSAGES } from '@/shared/constants/message.constants';

/**
 * Custom Hook điều khiển luồng điểm danh Kiosk V3:
 * Bước 1: Nhập Mã OTP 60s từ điện thoại cá nhân (step = 'otp') -> Backend tạo bản ghi PENDING
 * Bước 2: Kích hoạt Webcam chụp ảnh chân dung & Upload ảnh S3 (step = 'camera') -> Backend cập nhật COMPLETED
 * Bước 3: Modal kết quả phản hồi đếm ngược 3s tự động lặp lại (endless loop)
 */
export const useKioskCheckIn = () => {
  const { kioskToken, storeInfo } = useKiosk();

  // 'CHECK_IN' | 'CHECK_OUT'
  const [actionType, setActionType] = useState('CHECK_IN');

  // 'otp' | 'camera'
  const [step, setStep] = useState('otp');

  // Mã OTP 6 số
  const [otpValue, setOtpValue] = useState('');

  // Bản ghi điểm danh tạm thời ở trạng thái PENDING
  const [pendingRecord, setPendingRecord] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attendanceResult, setAttendanceResult] = useState(null);

  // Chuyển đổi giữa Chế độ Vào ca và Ra ca
  const handleSwitchAction = useCallback((type) => {
    setActionType(type);
    setOtpValue('');
    setErrorMsg('');
    setStep('otp');
    setPendingRecord(null);
  }, []);

  // Bước 1: Gửi mã OTP 60s lên Backend (Kiosk không cần biết UserId trước)
  const handleOtpSubmit = useCallback(
    async (codeToSubmit) => {
      const code = (codeToSubmit || otpValue).trim();
      if (!code || code.length < 6) {
        setErrorMsg(KIOSK_MESSAGES.ENTER_OTP_CODE);
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        const payload = {
          kioskDeviceToken: kioskToken || 'DEMO-KIOSK-TOKEN',
          otpCode: code,
        };

        const res =
          actionType === 'CHECK_IN'
            ? await attendanceService.kioskCheckInV3(payload)
            : await attendanceService.kioskCheckOutV3(payload);

        if (res?.success && res.data) {
          setPendingRecord(res.data);
          setStep('camera');
          setErrorMsg('');
        } else {
          setErrorMsg(res?.message || KIOSK_MESSAGES.INVALID_OTP_CODE);
          setOtpValue('');
        }
      } catch (err) {
        setErrorMsg(KIOSK_MESSAGES.NETWORK_ERROR);
        setOtpValue('');
      } finally {
        setLoading(false);
      }
    },
    [actionType, kioskToken, otpValue]
  );

  // Tự động gửi khi nhân viên nhập đủ 6 chữ số OTP
  useEffect(() => {
    if (step === 'otp' && otpValue.length === 6 && !loading) {
      handleOtpSubmit(otpValue);
    }
  }, [otpValue, step, loading, handleOtpSubmit]);

  // Bước 2: Chụp ảnh xác thực khuôn mặt và gửi lên Backend cập nhật COMPLETED
  const handleConfirmPhoto = useCallback(
    async (imageBase64) => {
      if (!pendingRecord) {
        setErrorMsg(KIOSK_MESSAGES.PHOTO_REQUIRED);
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        const payload = {
          kioskDeviceToken: kioskToken || 'DEMO-KIOSK-TOKEN',
          attendanceId: pendingRecord.attendanceId,
          imageBase64,
          photoType: actionType,
        };

        const res = await attendanceService.uploadAttendancePhotoV3(payload);

        if (res?.success) {
          const finalIsLate = res.data?.isLate ?? (res.data?.status === 'LATE' || res.data?.status === 'COMPLETED_LATE');
          const finalStatus = res.data?.status || (finalIsLate ? 'Late' : 'Present');

          setAttendanceResult({
            success: true,
            message: finalIsLate
              ? `Điểm danh vào ca thành công nhưng bị ghi nhận ĐI MUỘN (LATE) do quá thời gian ân hạn 5 phút.`
              : (res.message || KIOSK_MESSAGES.UPLOAD_PHOTO_SUCCESS),
            employee: {
              name: pendingRecord.employeeName || 'Nhân Viên',
              code: pendingRecord.employeeCode || 'NV',
            },
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            type: actionType === 'CHECK_IN' ? 'Vào ca (Check-in)' : 'Kết thúc ca (Check-out)',
            shiftName: pendingRecord.shiftName,
            isLate: finalIsLate,
            status: finalStatus,
            photoUrl: res.data?.presignedUrl || imageBase64,
          });
        } else {
          setErrorMsg(res?.message || KIOSK_MESSAGES.UPLOAD_PHOTO_FAILED);
        }
      } catch (err) {
        setErrorMsg(KIOSK_MESSAGES.UPLOAD_PHOTO_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [actionType, kioskToken, pendingRecord]
  );

  // Reset toàn bộ vòng lặp về màn hình chính sẵn sàng cho nhân viên tiếp theo
  const handleResetLoop = useCallback(() => {
    setStep('otp');
    setOtpValue('');
    setPendingRecord(null);
    setLoading(false);
    setErrorMsg('');
    setAttendanceResult(null);
  }, []);

  // Quay lại Bước 1 (Nhập lại OTP khác nếu muốn hủy lượt)
  const handleBackToOtp = useCallback(() => {
    setStep('otp');
    setOtpValue('');
    setPendingRecord(null);
    setErrorMsg('');
  }, []);

  return {
    actionType,
    setActionType: handleSwitchAction,
    step,
    otpValue,
    setOtpValue,
    pendingRecord,
    loading,
    errorMsg,
    attendanceResult,
    storeInfo,
    handleOtpSubmit,
    handleConfirmPhoto,
    handleResetLoop,
    handleBackToOtp,
  };
};

export default useKioskCheckIn;

