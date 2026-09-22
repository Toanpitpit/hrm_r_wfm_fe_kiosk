import React from 'react';
import ClockHeader from '@/shared/components/ClockHeader';
import PinKeypad from '@/shared/components/PinKeypad';
import AttendanceModal from '@/shared/components/AttendanceModal';
import KioskCameraCapture from '@/shared/components/KioskCameraCapture';
import { useKioskCheckIn } from '../../hooks/useKioskCheckIn';
import { KeyRound, ArrowLeft, LogIn, LogOut, ShieldCheck, Sparkles, User } from 'lucide-react';

export const KioskCheckInPage = () => {
  const {
    actionType,
    setActionType,
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
  } = useKioskCheckIn();

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Bar Header */}
      <ClockHeader />

      {/* Main Kiosk Area */}
      <main className="flex-1 p-3 sm:p-6 flex flex-col items-center justify-center relative overflow-y-auto">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Action Switcher Tabs (Check-in / Check-out) — Touch Target Lớn h-16 */}
        {step === 'otp' && (
          <div className="w-full max-w-sm sm:max-w-md grid grid-cols-2 gap-3 mb-4 z-10">
            <button
              type="button"
              disabled={loading}
              onClick={() => setActionType('CHECK_IN')}
              className={`h-16 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-95 border-2 ${
                actionType === 'CHECK_IN'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span>VÀO CA (CHECK-IN)</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setActionType('CHECK_OUT')}
              className={`h-16 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-95 border-2 ${
                actionType === 'CHECK_OUT'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span>RA CA (CHECK-OUT)</span>
            </button>
          </div>
        )}

        {/* Step Progress Bar (2 Bước V3) */}
        <div className="flex items-center space-x-3 mb-4 z-10">
          <div
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              step === 'otp'
                ? actionType === 'CHECK_IN'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'bg-slate-900/80 text-slate-500 border-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black ${
                actionType === 'CHECK_IN' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              1
            </span>
            <span>1. MÃ OTP 60S</span>
          </div>

          <div className="w-6 h-0.5 bg-slate-800" />

          <div
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              step === 'camera'
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/80 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span>2. CHỤP ẢNH XÁC THỰC</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold z-10 text-center max-w-sm animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Kiosk Main Content Box */}
        <div className="w-full max-w-sm sm:max-w-md kiosk-glass p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl z-10 flex flex-col items-center relative my-auto">
          {/* Nút Quay lại Bước 1 khi đang ở Camera */}
          {step === 'camera' && (
            <button
              onClick={handleBackToOtp}
              disabled={loading}
              className="absolute top-5 left-6 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Nhập lại OTP</span>
            </button>
          )}

          {/* Header Title */}
          <div className="text-center mb-4 mt-1">
            <div
              className={`inline-flex p-3 rounded-2xl border mb-2 ${
                actionType === 'CHECK_IN'
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
              }`}
            >
              {step === 'otp' ? <KeyRound className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              {step === 'otp'
                ? actionType === 'CHECK_IN'
                  ? 'XÁC THỰC CHECK-IN VÀO CA'
                  : 'XÁC THỰC CHECK-OUT RA CA'
                : 'CHỤP ẢNH XÁC THỰC CHÂN DUNG'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {step === 'otp'
                ? 'Nhập mã OTP 6 số hiển thị trên điện thoại cá nhân của bạn'
                : 'Nhìn thẳng vào ống kính máy ảnh để hoàn tất bản ghi điểm danh'}
            </p>
          </div>

          {/* BƯỚC 1: BÀN PHÍM SỐ OTP */}
          {step === 'otp' && (
            <PinKeypad
              mode="otp"
              value={otpValue}
              onChange={setOtpValue}
              onSubmit={handleOtpSubmit}
              maxLength={6}
              loading={loading}
              actionType={actionType}
            />
          )}

          {/* BƯỚC 2: CHỤP ẢNH XÁC THỰC KHOẢN MẶT */}
          {step === 'camera' && pendingRecord && (
            <div className="w-full space-y-4">
              {/* Card Thông tin Nhân viên đã xác thực từ Redis */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-black text-white truncate">
                      {pendingRecord.employeeName || 'Nhân Viên'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Mã NV: <strong className="text-blue-400">{pendingRecord.employeeCode || 'NV'}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PENDING (Chờ ảnh)
                  </span>
                </div>
              </div>

              {/* Component Chụp Ảnh Camera */}
              <KioskCameraCapture
                actionType={actionType}
                onConfirmCapture={handleConfirmPhoto}
                isUploading={loading}
                onReset={handleBackToOtp}
              />
            </div>
          )}
        </div>
      </main>

      {/* Result Feedback Modal (Tự động lặp lại vô tận sau 3 giây) */}
      <AttendanceModal result={attendanceResult} autoCloseSeconds={3} onClose={handleResetLoop} />
    </div>
  );
};

export default KioskCheckInPage;

