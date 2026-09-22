import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';

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
  const isLate = Boolean(result.isLate || result.status === 'Late');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border text-center relative overflow-hidden transition-all transform scale-100 ${
        !isSuccess
          ? 'bg-slate-900/95 border-red-500/40 shadow-red-500/20'
          : isLate
          ? 'bg-slate-900/95 border-amber-500/50 shadow-amber-500/20'
          : 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-500/20'
      }`}>
        {/* Top Indicator Bar */}
        <div className={`h-2 w-full absolute top-0 left-0 ${
          !isSuccess ? 'bg-red-500' : isLate ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />

        {/* Icon Header */}
        <div className="flex justify-center mb-4 mt-2">
          {!isSuccess ? (
            <div className="p-4 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
              <XCircle className="w-16 h-16" />
            </div>
          ) : isLate ? (
            <div className="p-4 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 animate-bounce">
              <Clock className="w-16 h-16" />
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 animate-bounce">
              <CheckCircle className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <h2 className={`text-2xl font-black uppercase tracking-wider ${
          !isSuccess ? 'text-red-400' : isLate ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {!isSuccess
            ? 'Điểm Danh Thất Bại'
            : isLate
            ? 'Vào Ca: Đi Muộn (LATE)'
            : 'Điểm Danh Thành Công!'}
        </h2>

        <p className="text-slate-300 text-sm mt-1">
          {result.message || (isSuccess ? 'Ghi nhận thời gian thành công' : 'Vui lòng kiểm tra lại thông tin')}
        </p>

        {/* Employee Detail Card */}
        {isSuccess && result.employee && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left space-y-2.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-lg">
                  {result.employee.name ? result.employee.name.charAt(0) : 'NV'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{result.employee.name || 'Nhân Viên'}</h3>
                  <p className="text-xs text-slate-400 font-mono">Mã NV: {result.employee.code || 'NV001'}</p>
                </div>
              </div>

              {isLate && (
                <span className="px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  LATE (ĐI MUỘN)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Giờ: <strong className="text-white font-mono">{result.timestamp || new Date().toLocaleTimeString()}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <UserCheck className={`w-4 h-4 ${isLate ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span>Loại: <strong className="text-white">{result.type || 'Vào ca'}</strong></span>
              </div>
              {result.shiftName && (
                <div className="col-span-2 text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
                  Ca làm việc: <strong className="text-blue-300">{result.shiftName}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button & Auto Close Timer (3 Seconds) */}
        <button
          onClick={onClose}
          className={`w-full mt-6 py-3.5 px-6 rounded-xl font-bold text-white transition-all shadow-lg ${
            !isSuccess
              ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              : isLate
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
          }`}
        >
          QUAY LẠI MÀN HÌNH BẮT ĐẦU ({countdown}s)
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;
