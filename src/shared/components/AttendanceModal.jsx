import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, UserCheck, AlertTriangle, Sparkles, Hourglass } from 'lucide-react';

const AttendanceModal = ({ result, onClose, autoCloseSeconds = 3 }) => {
  const [countdown, setCountdown] = useState(autoCloseSeconds);

  useEffect(() => {
    if (!result) return;

    setCountdown(autoCloseSeconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, onClose, autoCloseSeconds]);

  if (!result) return null;

  const isSuccess = result.success !== false;
  const isCheckIn = result.actionType === 'CHECK_IN' || result.type?.includes('Vào ca');

  // Xác định cấu hình theme & badge dựa trên trạng thái Check-in hoặc Check-out
  let badgeText = 'ĐÚNG GIỜ';
  let badgeTone = 'emerald'; // 'emerald' | 'amber' | 'blue' | 'orange' | 'red'
  let headerTitle = 'Điểm Danh Thành Công!';

  if (!isSuccess) {
    badgeText = 'THẤT BẠI';
    badgeTone = 'red';
    headerTitle = 'Điểm Danh Thất Bại';
  } else if (isCheckIn) {
    if (result.checkInStatus === 'EARLY') {
      badgeText = 'ĐẾN SỚM';
      badgeTone = 'blue';
      headerTitle = 'Vào Ca: Đến Sớm';
    } else if (result.checkInStatus === 'LATE' || result.isLate || result.status === 'LATE' || result.status === 'Late') {
      badgeText = result.lateMinutes ? `ĐI MUỘN (${result.lateMinutes} PHÚT)` : 'ĐI MUỘN (LATE)';
      badgeTone = 'amber';
      headerTitle = 'Vào Ca: Đi Muộn';
    } else {
      badgeText = 'ĐÚNG GIỜ';
      badgeTone = 'emerald';
      headerTitle = 'Vào Ca: Đúng Giờ!';
    }
  } else {
    // Check-out Flow
    if (result.checkOutStatus === 'EARLY_LEAVE') {
      badgeText = result.earlyLeaveMinutes ? `VỀ SỚM (${result.earlyLeaveMinutes} PHÚT)` : 'VỀ SỚM (EARLY LEAVE)';
      badgeTone = 'orange';
      headerTitle = 'Ra Ca: Về Sớm';
    } else if (result.checkOutStatus === 'LATE_LEAVE') {
      badgeText = 'RA CA MUỘN / TĂNG CA';
      badgeTone = 'indigo';
      headerTitle = 'Ra Ca: Hoàn Tất';
    } else {
      badgeText = 'ĐÚNG GIỜ';
      badgeTone = 'emerald';
      headerTitle = 'Ra Ca: Đúng Giờ!';
    }
  }

  // Cấu hình style theme
  const toneStyles = {
    red: {
      border: 'border-red-500/40 shadow-red-500/20',
      bar: 'bg-red-500',
      iconBg: 'bg-red-500/20 text-red-400 border-red-500/30',
      title: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300 border-red-500/40',
      btn: 'bg-red-600 hover:bg-red-500 shadow-red-600/30',
    },
    amber: {
      border: 'border-amber-500/50 shadow-amber-500/25',
      bar: 'bg-amber-500',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30',
    },
    orange: {
      border: 'border-orange-500/50 shadow-orange-500/25',
      bar: 'bg-orange-500',
      iconBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      title: 'text-orange-400',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      btn: 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30',
    },
    blue: {
      border: 'border-sky-500/50 shadow-sky-500/25',
      bar: 'bg-sky-500',
      iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      title: 'text-sky-400',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      btn: 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30',
    },
    indigo: {
      border: 'border-indigo-500/50 shadow-indigo-500/25',
      bar: 'bg-indigo-500',
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      title: 'text-indigo-400',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30',
    },
    emerald: {
      border: 'border-emerald-500/40 shadow-emerald-500/20',
      bar: 'bg-emerald-500',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30',
    },
  }[badgeTone] || {
    border: 'border-slate-700',
    bar: 'bg-slate-600',
    iconBg: 'bg-slate-800 text-slate-400',
    title: 'text-white',
    badge: 'bg-slate-800 text-slate-300',
    btn: 'bg-slate-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md p-7 sm:p-8 rounded-3xl shadow-2xl border text-center relative overflow-hidden transition-all transform scale-100 bg-slate-900/95 ${toneStyles.border}`}>
        {/* Top Indicator Bar */}
        <div className={`h-2.5 w-full absolute top-0 left-0 ${toneStyles.bar}`} />

        {/* Icon Header */}
        <div className="flex justify-center mb-3 mt-1">
          <div className={`p-4 rounded-full border animate-bounce ${toneStyles.iconBg}`}>
            {!isSuccess ? (
              <XCircle className="w-14 h-14" />
            ) : badgeTone === 'amber' || badgeTone === 'orange' ? (
              <AlertTriangle className="w-14 h-14" />
            ) : badgeTone === 'blue' ? (
              <Sparkles className="w-14 h-14" />
            ) : (
              <CheckCircle className="w-14 h-14" />
            )}
          </div>
        </div>

        {/* Status Title */}
        <h2 className={`text-2xl font-black uppercase tracking-wider ${toneStyles.title}`}>
          {headerTitle}
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm mt-1 px-2">
          {result.message || (isSuccess ? 'Ghi nhận thời gian thành công' : 'Vui lòng kiểm tra lại thông tin')}
        </p>

        {/* Employee Detail Card */}
        {isSuccess && result.employee && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left space-y-2.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-base flex-shrink-0">
                  {result.employee.name ? result.employee.name.charAt(0) : 'NV'}
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-white text-sm sm:text-base truncate">{result.employee.name || 'Nhân Viên'}</h3>
                  <p className="text-xs text-slate-400 font-mono">Mã NV: {result.employee.code || 'NV001'}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border flex-shrink-0 ml-2 ${toneStyles.badge}`}>
                {badgeText}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Giờ: <strong className="text-white font-mono">{result.timestamp || new Date().toLocaleTimeString()}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <UserCheck className={`w-4 h-4 flex-shrink-0 ${toneStyles.title}`} />
                <span>Loại: <strong className="text-white">{result.type || (isCheckIn ? 'Vào ca' : 'Ra ca')}</strong></span>
              </div>

              {result.shiftName && (
                <div className="col-span-2 text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
                  Ca làm việc: <strong className="text-blue-300">{result.shiftName}</strong>
                </div>
              )}

              {/* Thông tin số giờ làm việc thực tế cho Check-out */}
              {!isCheckIn && result.actualWorkMinutes != null && (
                <div className="col-span-2 text-[11px] text-emerald-400 pt-1 flex items-center gap-1.5 font-medium">
                  <Hourglass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tổng giờ làm việc ca này: <strong>{(result.actualWorkMinutes / 60).toFixed(1)} giờ</strong></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button & Auto Close Timer */}
        <button
          onClick={onClose}
          className={`w-full mt-5 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-white transition-all shadow-lg active:scale-95 ${toneStyles.btn}`}
        >
          QUAY LẠI MÀN HÌNH BẮT ĐẦU ({countdown}s)
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;
