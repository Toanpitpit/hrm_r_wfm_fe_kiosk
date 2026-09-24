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
  const [cameraTimeoutSeconds, setCameraTimeoutSeconds] = useState(45);

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

  // Hủy điểm danh & Thoát ra ngoài cho người tiếp theo
  const handleCancelAttendance = useCallback(async () => {
    if (pendingRecord?.attendanceId) {
      try {
        await attendanceService.cancelAttendance({
          kioskDeviceToken: kioskToken || 'DEMO-KIOSK-TOKEN',
          attendanceId: pendingRecord.attendanceId,
          actionType,
        });
      } catch (err) {
        console.warn('Lỗi khi gửi yêu cầu hủy điểm danh:', err);
      }
    }
    setStep('otp');
    setOtpValue('');
    setPendingRecord(null);
    setErrorMsg('');
    setLoading(false);
  }, [actionType, kioskToken, pendingRecord]);

  // Đếm ngược 45s khi đang ở camera, nếu không ai thao tác thì tự hủy để nhường người khác
  useEffect(() => {
    if (step !== 'camera') {
      setCameraTimeoutSeconds(45);
      return;
    }

    setCameraTimeoutSeconds(45);
    const interval = setInterval(() => {
      setCameraTimeoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleCancelAttendance();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, handleCancelAttendance]);

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
            message: res.data?.detailedMessage || res.message || (actionType === 'CHECK_IN' ? 'Check-in thành công' : 'Check-out thành công'),
            employee: {
              name: pendingRecord.employeeName || 'Nhân Viên',
              code: pendingRecord.employeeCode || 'NV',
            },
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            actionType,
            type: actionType === 'CHECK_IN' ? 'Vào ca (Check-in)' : 'Kết thúc ca (Check-out)',
            shiftName: pendingRecord.shiftName,
            isLate: finalIsLate,
            status: finalStatus,
            checkInStatus: res.data?.checkInStatus,
            checkOutStatus: res.data?.checkOutStatus,
            lateMinutes: res.data?.lateMinutes,
            earlyLeaveMinutes: res.data?.earlyLeaveMinutes,
            actualWorkMinutes: res.data?.actualWorkMinutes,
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
    cameraTimeoutSeconds,
    handleOtpSubmit,
    handleConfirmPhoto,
    handleResetLoop,
    handleCancelAttendance,
    handleBackToOtp: handleCancelAttendance,
  };
};

export default useKioskCheckIn;

