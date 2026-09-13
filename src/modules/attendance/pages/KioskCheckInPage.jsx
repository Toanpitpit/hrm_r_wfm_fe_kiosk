import React, { useState, useEffect } from 'react';
import ClockHeader from '@/shared/components/ClockHeader';
import PinKeypad from '@/shared/components/PinKeypad';
import AttendanceModal from '@/shared/components/AttendanceModal';
import { attendanceService } from '../services/attendance.service';
import { useKiosk } from '@/shared/context/KioskContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { KeyRound, ArrowLeft, DollarSign, LogIn, LogOut, AlertTriangle } from 'lucide-react';

const KioskCheckInPage = () => {
  const { storeInfo } = useKiosk();
  const storeId = storeInfo?.storeId || 1;
  const kioskId = storeInfo?.kioskId || null;

  // Step 1: 'code' (Nhập Mã Nhân Viên) | Step 2: 'pin' (Nhập Mã PIN) | Step 3: 'action' (Chọn CheckIn/CheckOut & Tiền Lẻ)
  const [step, setStep] = useState('code');
  const [employeeCode, setEmployeeCode] = useState('');
  const [pinValue, setPinValue] = useState('');
  
  const [validatedEmployee, setValidatedEmployee] = useState(null);
  const [openingFloat, setOpeningFloat] = useState('500000');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attendanceResult, setAttendanceResult] = useState(null);

  // Tra cứu gợi ý theo Mã NV với useDebounce (chờ 2 giây sau khi dừng nhập)
  const debouncedEmployeeCode = useDebounce(employeeCode, 2000);
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

  // Xử lý Bước 1: Tiếp tục sang nhập PIN
  const handleCodeSubmit = (code) => {
    if (!code || code.trim().length === 0) {
      setErrorMsg('Vui lòng chọn hoặc nhập Mã Nhân Viên.');
      return;
    }
    setErrorMsg('');
    setStep('pin');
    setPinValue('');
  };

  // Xử lý Bước 2: Gọi API Validate PIN
  const handlePinSubmit = async (pin) => {
    if (!pin || pin.length < 4) {
      setErrorMsg('Vui lòng nhập đầy đủ Mã PIN (4-6 chữ số).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await attendanceService.validatePin(storeId, employeeCode, pin);
      if (res.success && res.data) {
        setValidatedEmployee(res.data);

        if (!res.data.hasShiftToday) {
          setErrorMsg(`Nhân viên ${res.data.fullName} không có lịch phân công ca hôm nay tại chi nhánh này.`);
          setStep('code');
          return;
        }

        setStep('action');
      } else {
        setErrorMsg(res.message || 'Mã PIN hoặc Mã Nhân Viên không hợp lệ.');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối máy chủ điểm danh. Vui lòng kiểm tra lại mạng.');
    } finally {
      setLoading(false);
    }
  };

  // Thực hiện Check-In
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
        employee: res.success ? {
          code: res.data?.employeeCode || validatedEmployee.employeeCode,
          name: res.data?.employeeName || validatedEmployee.fullName,
        } : null,
        type: 'CHECK-IN VÀO CA',
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      });
    } catch (err) {
      setAttendanceResult({
        success: false,
        message: 'Lỗi hệ thống khi điểm danh vào ca.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Thực hiện Check-Out
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
        employee: res.success ? {
          code: res.data?.employeeCode || validatedEmployee.employeeCode,
          name: res.data?.employeeName || validatedEmployee.fullName,
        } : null,
        type: 'CHECK-OUT KẾT THÚC CA',
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      });
    } catch (err) {
      setAttendanceResult({
        success: false,
        message: 'Lỗi hệ thống khi điểm danh kết thúc ca.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset vòng lặp về Bước 1 cho nhân viên tiếp theo
  const handleResetLoop = () => {
    setAttendanceResult(null);
    setStep('code');
    setEmployeeCode('');
    setPinValue('');
    setValidatedEmployee(null);
    setErrorMsg('');
  };

  // Quay lại Bước 1
  const handleBackToStep1 = () => {
    setStep('code');
    setPinValue('');
    setErrorMsg('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Bar Header */}
      <ClockHeader />

      {/* Main Kiosk Area */}
      <main className="flex-1 p-3 sm:p-6 flex flex-col items-center justify-center relative overflow-y-auto">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Progress Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 z-10 flex-wrap justify-center">
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 border transition-all ${
            step === 'code'
              ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-800'
          }`}>
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>BƯỚC 1: MÃ NV</span>
          </div>

          <div className="w-4 sm:w-6 h-0.5 bg-slate-800" />

          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 border transition-all ${
            step === 'pin' || step === 'action'
              ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-800'
          }`}>
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>BƯỚC 2: XÁC NHẬN</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold z-10 text-center max-w-sm">
            {errorMsg}
          </div>
        )}

        {/* Kiosk Content Box */}
        <div className="w-full max-w-sm sm:max-w-md kiosk-glass p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl z-10 flex flex-col items-center relative my-auto">
          
          {/* Quay lại Bước 1 */}
          {(step === 'pin' || step === 'action') && (
            <button
              onClick={handleBackToStep1}
              disabled={loading}
              className="absolute top-4 sm:top-6 left-4 sm:left-6 text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Đổi Mã NV</span>
            </button>
          )}

          {/* Header Title */}
          <div className="text-center mb-3 sm:mb-4 mt-1">
            <div className="inline-flex p-2.5 sm:p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 mb-2">
              <KeyRound className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
              {step === 'code' ? 'ĐIỂM DANH KIOSK QUẦY' : step === 'pin' ? 'XÁC NHẬN MÃ PIN CÁ NHÂN' : 'LỰA CHỌN THAO TÁC CA'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {step === 'code'
                ? 'Vui lòng chọn hoặc nhập Mã Nhân Viên của bạn'
                : step === 'pin'
                ? `Nhập mã PIN cho nhân viên ${employeeCode.toUpperCase()}`
                : `Chào ${validatedEmployee?.fullName} (${validatedEmployee?.positionName})`}
            </p>
          </div>

          {/* Step 1 & Step 2 Keypad */}
          {(step === 'code' || step === 'pin') && (
            <PinKeypad
              mode={step}
              value={step === 'code' ? employeeCode : pinValue}
              onChange={step === 'code' ? setEmployeeCode : setPinValue}
              onSubmit={step === 'code' ? handleCodeSubmit : handlePinSubmit}
              employeeInfo={validatedEmployee}
              loading={loading}
              suggestions={step === 'code' ? suggestions : []}
              isSearching={isSearching}
              onSelectSuggestion={handleSelectSuggestion}
            />
          )}

          {/* Step 3: Action Choice (Check-In or Check-Out) */}
          {step === 'action' && validatedEmployee && (
            <div className="w-full space-y-4">
              {/* Employee & Shift Info Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white">{validatedEmployee.fullName}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
                    {validatedEmployee.employeeCode}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Lịch ca hôm nay:</span>
                  <strong className="text-emerald-400 font-medium">{validatedEmployee.shiftName}</strong>
                </div>
              </div>

              {/* Nếu là Thu ngân & Chưa Check-in -> Nhập tiền lẻ bàn giao đầu ca */}
              {!validatedEmployee.hasCheckedIn && validatedEmployee.positionCode === 'CASHIER' && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-left space-y-1.5">
                  <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Số Tiền Lẻ Bàn Giao Đầu Ca (Opening Float)</span>
                  </label>
                  <input
                    type="number"
                    value={openingFloat}
                    onChange={(e) => setOpeningFloat(e.target.value)}
                    placeholder="VD: 500000"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-indigo-500/40 rounded-xl text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-[10px] text-slate-400">Tiền mặt lẻ trong két đầu ca để thối lại cho khách</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {!validatedEmployee.hasCheckedIn ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleDoCheckIn}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-6 h-6" />
                        <span>XÁC NHẬN CHECK-IN VÀO CA</span>
                      </>
                    )}
                  </button>
                ) : !validatedEmployee.hasCheckedOut ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleDoCheckOut}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogOut className="w-6 h-6" />
                        <span>XÁC NHẬN CHECK-OUT KẾT THÚC CA</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-emerald-400" />
                    <span>Bạn đã hoàn thành điểm danh cả vào ca và ra ca hôm nay!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Result Feedback Modal (3s Auto Close -> Loops back to Step 1) */}
      <AttendanceModal
        result={attendanceResult}
        autoCloseSeconds={3}
        onClose={handleResetLoop}
      />
    </div>
  );
};

export default KioskCheckInPage;
