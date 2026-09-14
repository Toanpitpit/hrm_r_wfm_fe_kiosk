import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendance.service';
import { useKiosk } from '@/shared/context/KioskContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { KIOSK_MESSAGES } from '@/shared/constants/message.constants';

export const useKioskCheckIn = () => {
  const { storeInfo } = useKiosk();
  const storeId = storeInfo?.storeId || 1;
  const kioskId = storeInfo?.kioskId || null;

  // Step 1: 'code' | Step 2: 'pin' | Step 3: 'action'
  const [step, setStep] = useState('code');
  const [employeeCode, setEmployeeCode] = useState('');
  const [pinValue, setPinValue] = useState('');

  const [validatedEmployee, setValidatedEmployee] = useState(null);
  const [openingFloat, setOpeningFloat] = useState('500000');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attendanceResult, setAttendanceResult] = useState(null);

  // Debounced search for employee suggestions
  const debouncedEmployeeCode = useDebounce(employeeCode, 1000);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (step !== 'code' || !debouncedEmployeeCode || debouncedEmployeeCode.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await attendanceService.searchStoreEmployees(storeId, debouncedEmployeeCode);
        if (res.success && Array.isArray(res.data)) {
          setSuggestions(res.data);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedEmployeeCode, storeId, step]);

  const handleSelectSuggestion = (item) => {
    setEmployeeCode(item.employeeCode);
    setSuggestions([]);
  };

  const handleCodeSubmit = (code) => {
    if (!code || code.trim().length === 0) {
      setErrorMsg(KIOSK_MESSAGES.ENTER_EMPLOYEE_CODE);
      return;
    }
    setErrorMsg('');
    setStep('pin');
    setPinValue('');
  };

  const handlePinSubmit = async (pin) => {
    if (!pin || pin.length < 4) {
      setErrorMsg(KIOSK_MESSAGES.ENTER_FULL_PIN);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await attendanceService.validatePin(storeId, employeeCode, pin);
      if (res.success && res.data) {
        setValidatedEmployee(res.data);

        if (!res.data.hasShiftToday) {
          setErrorMsg(KIOSK_MESSAGES.NO_SHIFT_TODAY(res.data.fullName));
          setStep('code');
          return;
        }

        setStep('action');
      } else {
        setErrorMsg(res.message || KIOSK_MESSAGES.INVALID_PIN_OR_CODE);
      }
    } catch (err) {
      setErrorMsg(KIOSK_MESSAGES.ATTENDANCE_NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDoCheckIn = async () => {
    if (!validatedEmployee) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await attendanceService.kioskCheckIn({
        employeeId: validatedEmployee.employeeId,
        storeId,
        pinCode: pinValue,
        kioskId,
        openingFloatCash: validatedEmployee.positionCode === 'CASHIER' ? Number(openingFloat) : null,
      });

      setAttendanceResult({
        success: res.success,
        message: res.message,
        employee: res.success
          ? {
              code: res.data?.employeeCode || validatedEmployee.employeeCode,
              name: res.data?.employeeName || validatedEmployee.fullName,
            }
          : null,
        type: 'CHECK-IN VÀO CA',
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      });
    } catch (err) {
      setAttendanceResult({
        success: false,
        message: KIOSK_MESSAGES.CHECK_IN_SYSTEM_ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDoCheckOut = async () => {
    if (!validatedEmployee) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await attendanceService.kioskCheckOut({
        employeeId: validatedEmployee.employeeId,
        storeId,
        pinCode: pinValue,
        kioskId,
      });

      setAttendanceResult({
        success: res.success,
        message: res.message,
        employee: res.success
          ? {
              code: res.data?.employeeCode || validatedEmployee.employeeCode,
              name: res.data?.employeeName || validatedEmployee.fullName,
            }
          : null,
        type: 'CHECK-OUT KẾT THÚC CA',
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      });
    } catch (err) {
      setAttendanceResult({
        success: false,
        message: KIOSK_MESSAGES.CHECK_OUT_SYSTEM_ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetLoop = () => {
    setAttendanceResult(null);
    setStep('code');
    setEmployeeCode('');
    setPinValue('');
    setValidatedEmployee(null);
    setErrorMsg('');
  };

  const handleBackToStep1 = () => {
    setStep('code');
    setPinValue('');
    setErrorMsg('');
  };

  return {
    step,
    employeeCode,
    setEmployeeCode,
    pinValue,
    setPinValue,
    validatedEmployee,
    openingFloat,
    setOpeningFloat,
    loading,
    errorMsg,
    attendanceResult,
    suggestions,
    isSearching,
    handleSelectSuggestion,
    handleCodeSubmit,
    handlePinSubmit,
    handleDoCheckIn,
    handleDoCheckOut,
    handleResetLoop,
    handleBackToStep1,
  };
};

export default useKioskCheckIn;
