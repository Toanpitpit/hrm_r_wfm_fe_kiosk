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
    cameraTimeoutSeconds,
    handleOtpSubmit,
    handleConfirmPhoto,
    handleResetLoop,
    handleCancelAttendance,
    handleBackToOtp,
  } = useKioskCheckIn();

  return (
    <div className="min-h-screen h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Bar Header */}
      <ClockHeader />

      {/* Main Kiosk Area */}
      <main className="flex-1 p-2.5 sm:p-5 md:p-6 flex flex-col items-center justify-start sm:justify-center relative overflow-y-auto safe-pb">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Action Switcher Tabs (Check-in / Check-out) — Chỉ hiện trên Mobile & Tablet Portrait */}
        {step === 'otp' && (
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:hidden grid grid-cols-2 gap-2 sm:gap-3 mb-2.5 sm:mb-4 z-10 shrink-0">
            <button
              type="button"
              disabled={loading}
              onClick={() => setActionType('CHECK_IN')}
              className={`h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all active:scale-95 border-2 touch-manipulation ${
                actionType === 'CHECK_IN'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">VÀO CA (IN)</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setActionType('CHECK_OUT')}
              className={`h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all active:scale-95 border-2 touch-manipulation ${
                actionType === 'CHECK_OUT'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">RA CA (OUT)</span>
            </button>
          </div>
        )}

        {/* Step Progress Bar (2 Bước V3) — Cho Mobile & Tablet Portrait */}
        <div className="flex lg:hidden items-center space-x-2 sm:space-x-3 mb-2.5 sm:mb-4 z-10 shrink-0">
          <div
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 border transition-all ${
              step === 'otp'
                ? actionType === 'CHECK_IN'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'bg-slate-900/80 text-slate-500 border-slate-800'
            }`}
          >
            <span
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 ${
                actionType === 'CHECK_IN' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              1
            </span>
            <span>1. MÃ OTP 60S</span>
          </div>

          <div className="w-4 sm:w-6 h-0.5 bg-slate-800 shrink-0" />

          <div
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 border transition-all ${
              step === 'camera'
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/80 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
              2
            </span>
            <span>2. CHỤP ẢNH</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-2.5 sm:mb-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold z-10 text-center max-w-sm md:max-w-md animate-fade-in shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Kiosk Main Content Master Card — Tự động co giãn: Mobile (max-w-sm), iPad Portrait (md:max-w-lg), iPad Landscape & POS (lg:max-w-4xl xl:max-w-5xl) */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl kiosk-glass p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl z-10 relative my-auto shrink-0 transition-all">
          {/* ======================================================== */}
          {/* BƯỚC 1: NHẬP MÃ OTP 6 SỐ */}
          {/* ======================================================== */}
          {step === 'otp' && (
            <>
              {/* --- Bố cục 1 cột: Dành cho Mobile & iPad Portrait (< lg) --- */}
              <div className="lg:hidden flex flex-col items-center">
                <div className="text-center mb-3 sm:mb-4 mt-0.5 sm:mt-1">
                  <div
                    className={`inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl border mb-1.5 sm:mb-2 ${
                      actionType === 'CHECK_IN'
                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    <KeyRound className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h2 className="text-base sm:text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                    {actionType === 'CHECK_IN' ? 'XÁC THỰC CHECK-IN VÀO CA' : 'XÁC THỰC CHECK-OUT RA CA'}
                  </h2>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-0.5 sm:mt-1 max-w-xs sm:max-w-none">
                    Nhập mã OTP 6 số hiển thị trên điện thoại cá nhân của bạn
                  </p>
                </div>

                <PinKeypad
                  mode="otp"
                  value={otpValue}
                  onChange={setOtpValue}
                  onSubmit={handleOtpSubmit}
                  maxLength={6}
                  loading={loading}
                  actionType={actionType}
                />
              </div>

              {/* --- Bố cục 2 cột: Dành cho iPad Landscape, iPad Pro & Màn Kiosk POS (>= lg) --- */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                {/* Cột Trái (Left Panel): Tabs & Hướng Dẫn */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-5 h-full">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Bước 1: Xác Thực Mã Ca</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide leading-tight">
                      TRẠM CHẤM CÔNG KIOSK
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Chọn thao tác Vào ca hoặc Ra ca, sau đó nhập mã OTP 60 giây từ ứng dụng điện thoại.
                    </p>
                  </div>

                  {/* 2 Tabs chuyển đổi chế độ cảm ứng lớn */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setActionType('CHECK_IN')}
                      className={`h-16 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all active:scale-95 touch-manipulation ${
                        actionType === 'CHECK_IN'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                          : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <LogIn className="w-5 h-5 shrink-0" />
                      <span>VÀO CA (IN)</span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setActionType('CHECK_OUT')}
                      className={`h-16 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all active:scale-95 touch-manipulation ${
                        actionType === 'CHECK_OUT'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                          : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <LogOut className="w-5 h-5 shrink-0" />
                      <span>RA CA (OUT)</span>
                    </button>
                  </div>

                  {/* Visual Guide 3 Steps */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>QUY TRÌNH ĐIỂM DANH KHÔNG CHẠM</span>
                    </div>
                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                        <span>Mở ứng dụng <strong>R-WFM</strong> trên điện thoại cá nhân.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                        <span>Bấm <strong>"Lấy Mã Điểm Danh OTP (60s)"</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                        <span>Nhập 6 số vào bàn phím bên phải để chuyển sang bước chụp ảnh.</span>
                      </div>
                    </div>
                  </div>

                  {/* Terminal info */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Mã hóa bảo mật OTP 60 giây</span>
                    <span className="font-mono text-[11px] text-blue-400 font-bold">{storeInfo?.terminalId || 'KIOSK-POS'}</span>
                  </div>
                </div>

                {/* Cột Phải (Right Panel): PinPad & Ô Số */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center pl-2">
                  <div className="text-center mb-3">
                    <h3 className="text-xl font-black text-white uppercase tracking-wide">
                      {actionType === 'CHECK_IN' ? 'XÁC THỰC CHECK-IN VÀO CA' : 'XÁC THỰC CHECK-OUT RA CA'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Nhập mã OTP 6 số hiển thị trên điện thoại cá nhân của bạn
                    </p>
                  </div>

                  <PinKeypad
                    mode="otp"
                    value={otpValue}
                    onChange={setOtpValue}
                    onSubmit={handleOtpSubmit}
                    maxLength={6}
                    loading={loading}
                    actionType={actionType}
                  />
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* BƯỚC 2: CHỤP ẢNH XÁC THỰC CHÂN DUNG */}
          {/* ======================================================== */}
          {step === 'camera' && pendingRecord && (
            <>
              {/* --- Bố cục 1 cột: Dành cho Mobile & iPad Portrait (< lg) --- */}
              <div className="lg:hidden w-full space-y-3.5">
                {/* Nút Hủy / Thoát ra khi đang ở Camera */}
                <button
                  onClick={handleCancelAttendance}
                  disabled={loading}
                  className="text-slate-400 hover:text-red-400 flex items-center gap-1 text-[11px] sm:text-xs font-bold transition-colors active:scale-95 touch-manipulation mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Hủy & Thoát ({cameraTimeoutSeconds}s)</span>
                </button>

                {/* Header Title */}
                <div className="text-center mb-2">
                  <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wide">
                    CHỤP ẢNH XÁC THỰC CHÂN DUNG
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Nhìn thẳng vào ống kính máy ảnh để hoàn tất điểm danh
                  </p>
                </div>

                {/* Card Thông tin Nhân viên */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold flex items-center justify-center text-sm shrink-0">
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

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      PENDING
                    </span>
                  </div>
                </div>

                {/* Component Chụp Ảnh Camera */}
                <KioskCameraCapture
                  actionType={actionType}
                  onConfirmCapture={handleConfirmPhoto}
                  isUploading={loading}
                  onReset={handleCancelAttendance}
                  onCancel={handleCancelAttendance}
                  timeoutSeconds={cameraTimeoutSeconds}
                />
              </div>

              {/* --- Bố cục 2 cột: Dành cho iPad Landscape, iPad Pro & Màn Kiosk POS (>= lg) --- */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                {/* Cột Trái (Left Panel): Info Nhân viên & Hướng dẫn */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4 h-full">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Bước 2: Chụp Ảnh Chân Dung</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                      XÁC THỰC KHUÔN MẶT
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Nhìn thẳng vào ống kính máy ảnh bên cạnh và giữ gương mặt trong khung hình.
                    </p>
                  </div>

                  {/* Card Thông tin Nhân viên */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold flex items-center justify-center text-base shrink-0">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-black text-white truncate">
                          {pendingRecord.employeeName || 'Nhân Viên'}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Mã NV: <strong className="text-blue-400">{pendingRecord.employeeCode || 'NV'}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Trạng thái xác thực:</span>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PENDING (Chờ ảnh)
                      </span>
                    </div>
                  </div>

                  {/* Posing Guide */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>HƯỚNG DẪN CHỤP ẢNH CHÂN DUNG</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Vui lòng tháo khẩu trang, nhìn thẳng vào ống kính máy ảnh và bấm nút <strong>"CHỤP ẢNH & HOÀN TẤT"</strong>.
                    </p>
                  </div>

                  {/* Nút Hủy & Thoát ra */}
                  <button
                    onClick={handleCancelAttendance}
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-slate-900/90 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/40 flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 touch-manipulation"
                  >
                    <ArrowLeft className="w-4 h-4 text-red-400" />
                    <span>HỦY ĐIỂM DANH & THOÁT RA ({cameraTimeoutSeconds}s)</span>
                  </button>
                </div>

                {/* Cột Phải (Right Panel): Live Webcam */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center pl-2">
                  <KioskCameraCapture
                    actionType={actionType}
                    onConfirmCapture={handleConfirmPhoto}
                    isUploading={loading}
                    onReset={handleCancelAttendance}
                    onCancel={handleCancelAttendance}
                    timeoutSeconds={cameraTimeoutSeconds}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Result Feedback Modal (Tự động lặp lại vô tận sau 3 giây) */}
      <AttendanceModal result={attendanceResult} autoCloseSeconds={3} onClose={handleResetLoop} />
    </div>
  );
};

export default KioskCheckInPage;

