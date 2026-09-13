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
    <header className="w-full kiosk-glass px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 shadow-xl border-b border-slate-800/80 z-20">
      {/* Store & Terminal Name */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Store className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate max-w-[180px] sm:max-w-[240px]">
              {storeInfo?.storeName || 'Cửa Hàng Chi Nhánh'}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
              <span>Terminal: {storeInfo?.terminalId || 'KIOSK-MAIN'}</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="text-emerald-400 hidden sm:flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Active
              </span>
            </p>
          </div>
        </div>

        {/* Mobile Network Status (Visible on tiny screens) */}
        <div className="sm:hidden flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 border ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}>
            <Wifi className={`w-3.5 h-3.5 ${isOnline ? 'animate-pulse text-emerald-400' : 'text-red-400'}`} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {logoutKiosk && (
            <button
              onClick={handleLogoutConfirm}
              title="Đăng xuất / Hủy ghép nối Kiosk"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Clock */}
      <div className="text-center">
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider font-mono drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]">
          {formattedTime}
        </div>
        <div className="text-[10px] sm:text-xs text-slate-400 font-medium capitalize mt-0.5">
          {formattedDate}
        </div>
      </div>

      {/* Network Status & Quick Action (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${
          isOnline
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-red-500/10 text-red-400 border-red-500/30'
        }`}>
          <Wifi className={`w-4 h-4 ${isOnline ? 'animate-pulse text-emerald-400' : 'text-red-400'}`} />
          <span>{isOnline ? 'Trực Tuyến' : 'Ngoại Tuyến'}</span>
        </div>

        {logoutKiosk && (
          <button
            onClick={handleLogoutConfirm}
            title="Hủy ghép nối / Đăng xuất Kiosk"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default ClockHeader;
