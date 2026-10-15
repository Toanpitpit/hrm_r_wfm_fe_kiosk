import React from 'react';
import { useClock } from '@/shared/hooks/useClock';
import { Store, Wifi, ShieldCheck, LogOut } from 'lucide-react';
import { useKiosk } from '@/shared/context/KioskContext';

const ClockHeader = () => {
  const { formattedTime, formattedDate } = useClock();
  const { storeInfo, isOnline, logoutKiosk } = useKiosk();

  const handleLogoutConfirm = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy ghép nối / đăng xuất trạm Kiosk này không?\n\nTrạm Kiosk sẽ ngắt kết nối và quay về màn hình nhập mã kích hoạt OTP mới.')) {
      logoutKiosk();
    }
  };

  return (
    <header className="w-full kiosk-glass px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-xl border-b border-slate-800/80 z-20 safe-pt transition-all">
      {/* Store & Terminal Name */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
        <div className="p-2 sm:p-2.5 md:p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shrink-0">
          <Store className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-wide truncate max-w-[130px] sm:max-w-[200px] md:max-w-[280px]">
            {storeInfo?.storeName || 'Cửa Hàng Chi Nhánh'}
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 sm:gap-1.5 truncate">
            <span className="truncate">POS: {storeInfo?.terminalId || 'KIOSK-MAIN'}</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></span>
            <span className="text-emerald-400 hidden sm:flex items-center gap-1 font-medium shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" /> Hoạt động
            </span>
          </p>
        </div>
      </div>

      {/* Real-time Clock */}
      <div className="text-center px-2">
        <div className="text-base sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider font-mono drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] leading-tight">
          {formattedTime}
        </div>
        <div className="text-[9px] sm:text-xs text-slate-400 font-medium capitalize hidden min-[400px]:block mt-0.5 truncate max-w-[140px] sm:max-w-none">
          {formattedDate}
        </div>
      </div>

      {/* Network Status & Quick Action (All Screens) */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {/* Network Badge */}
        <div className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-2 border transition-all ${
          isOnline
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-red-500/10 text-red-400 border-red-500/30'
        }`}>
          <Wifi className={`w-3 h-3 sm:w-4 sm:h-4 ${isOnline ? 'animate-pulse text-emerald-400' : 'text-red-400'}`} />
          <span className="hidden sm:inline">{isOnline ? 'Trực Tuyến' : 'Ngoại Tuyến'}</span>
          <span className="sm:hidden">{isOnline ? 'Online' : 'Off'}</span>
        </div>

        {logoutKiosk && (
          <button
            onClick={handleLogoutConfirm}
            title="Hủy ghép nối / Đăng xuất Kiosk"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default ClockHeader;
