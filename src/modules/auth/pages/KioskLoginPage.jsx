import React, { useState } from 'react';
import { useKiosk } from '@/shared/context/KioskContext';
import { authService } from '../services/auth.service';
import { Store, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

const KioskLoginPage = () => {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginKiosk } = useKiosk();
  const navigate = useNavigate();

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      setError('Vui lòng nhập Mã Kích Hoạt Kiosk (OTP) từ Quản lý cửa hàng.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.activateKiosk(activationCode);
      if (res.success && res.data) {
        // Lưu token và thông tin cửa hàng vào KioskContext
        loginKiosk(res.data.deviceToken, {
          kioskId: res.data.kioskId,
          storeId: res.data.storeId,
          storeCode: res.data.storeCode,
          storeName: res.data.storeName,
          kioskCode: res.data.kioskCode,
          kioskName: res.data.kioskName,
        });
        navigate(ROUTES.CHECKIN);
      } else {
        setError(res.message || 'Mã Kích Hoạt Kiosk không chính xác hoặc đã hết hạn.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ Backend API. Vui lòng kiểm tra lại kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="w-full max-w-md kiosk-glass p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Background Glowing aura */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-4 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 mb-4 shadow-lg">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            KÍCH HOẠT TRẠM KIOSK QUẦY
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Nhập Mã Kích Hoạt OTP (POS-XXXX) do Cửa hàng trưởng cấp để khởi tạo trạm
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleActivate} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Mã Kích Hoạt Kiosk (Activation Code)
            </label>
            <div className="relative">
              <input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="VD: POS-1234"
                className="w-full px-4 py-3.5 bg-slate-900/90 border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono uppercase tracking-widest text-center text-lg font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Gợi ý: Cửa hàng trưởng gọi API <code className="text-blue-300">create-code</code> để lấy mã</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>KÍCH HOẠT VẬN HÀNH KIOSK</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] text-slate-500">
          R-WFM Platform • Retail Chain Kiosk System v1.0
        </div>
      </div>
    </div>
  );
};

export default KioskLoginPage;
