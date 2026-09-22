import React from 'react';
import { Delete, RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Search, Loader2, KeyRound } from 'lucide-react';

const PinKeypad = ({
  value,
  onChange,
  onSubmit,
  mode = 'otp', // 'otp' | 'code' | 'pin'
  employeeInfo = null,
  maxLength = 6,
  loading = false,
  suggestions = [],
  isSearching = false,
  onSelectSuggestion,
  actionType = 'CHECK_IN', // 'CHECK_IN' | 'CHECK_OUT'
}) => {
  const handleDigit = (digit) => {
    if (mode === 'otp' || mode === 'pin') {
      if (value.length < maxLength && !loading) {
        onChange(value + digit);
      }
    } else {
      if (!loading) {
        onChange((value + digit).toUpperCase());
      }
    }
  };

  const handleDelete = () => {
    if (!loading && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!loading) {
      onChange('');
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center relative">
      {/* Thông tin Nhân Viên nếu có */}
      {employeeInfo && (
        <div className="w-full mb-4 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold flex items-center justify-center text-sm">
            {employeeInfo.fullName ? employeeInfo.fullName.charAt(0) : 'NV'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{employeeInfo.fullName}</div>
            <div className="text-[11px] text-blue-300 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mã NV: {employeeInfo.employeeCode} ({employeeInfo.positionName || 'Nhân viên'})</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Display: 6 Ô Số OTP Hiển Thị Rõ Nét */}
      <div className="w-full mb-5 relative z-20">
        {mode === 'otp' ? (
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {Array.from({ length: maxLength }).map((_, index) => {
              const char = value[index];
              const isCurrent = index === value.length && !loading;
              return (
                <div
                  key={index}
                  className={`w-12 h-14 sm:w-13 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-black text-2xl sm:text-3xl transition-all duration-200 border-2 ${
                    char
                      ? actionType === 'CHECK_IN'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)] scale-105'
                        : 'bg-blue-950/40 border-blue-500 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)] scale-105'
                      : isCurrent
                      ? 'bg-slate-900 border-blue-400/70 text-slate-400 animate-pulse ring-2 ring-blue-500/20'
                      : 'bg-slate-900/80 border-slate-700/80 text-slate-600'
                  }`}
                >
                  {char || ''}
                </div>
              );
            })}
          </div>
        ) : mode === 'pin' ? (
          <div className="h-16 px-4 bg-slate-900/90 border-2 border-slate-700 rounded-2xl flex items-center justify-center space-x-3 shadow-inner">
            {Array.from({ length: maxLength }).map((_, index) => (
              <div
                key={index}
                className={`w-5 h-5 rounded-full transition-all duration-200 ${
                  index < value.length
                    ? 'bg-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                    : 'bg-slate-700/60 border border-slate-600'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="h-16 px-4 bg-slate-900/90 border-2 border-slate-700 focus-within:border-blue-500 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="w-full flex items-center space-x-2">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                placeholder="Nhập Mã NV (VD: CSH001, SAL001)"
                disabled={loading}
                className="w-full bg-transparent text-xl font-black font-mono tracking-wider text-blue-400 uppercase placeholder:text-slate-600 placeholder:font-sans placeholder:text-sm focus:outline-none"
              />
              {isSearching && <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />}
            </div>
          </div>
        )}

        {/* Dropdown Gợi Ý Tìm Kiếm Mã NV (nếu dùng mode code) */}
        {mode === 'code' && suggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-30 max-h-48 overflow-y-auto divide-y divide-slate-800/60">
            {suggestions.map((item) => (
              <button
                key={item.employeeId || item.employeeCode}
                type="button"
                onClick={() => {
                  if (onSelectSuggestion) {
                    onSelectSuggestion(item);
                  } else {
                    onChange(item.employeeCode);
                  }
                }}
                className="w-full p-3 text-left hover:bg-blue-600/20 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/30">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">{item.fullName}</span>
                    <span className="text-[11px] text-slate-400 block">{item.positionName || 'Nhân viên'}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-1 rounded-lg border border-blue-800/50 group-hover:border-blue-500">
                  {item.employeeCode}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Touch Keypad Grid — Touch Target Lớn h-16, Active Scale 95 */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {keys.map((num) => (
          <button
            key={num}
            type="button"
            disabled={loading}
            onClick={() => handleDigit(num)}
            className="h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-blue-600 active:scale-95 text-white font-black text-2xl shadow-md border border-slate-700/80 transition-all flex items-center justify-center select-none"
          >
            {num}
          </button>
        ))}

        {/* Clear Action (C) */}
        <button
          type="button"
          disabled={loading || value.length === 0}
          onClick={handleClear}
          className="h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white font-bold text-sm border border-slate-800 transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none select-none"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Xóa Hết</span>
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleDigit('0')}
          className="h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-blue-600 active:scale-95 text-white font-black text-2xl shadow-md border border-slate-700/80 transition-all flex items-center justify-center select-none"
        >
          0
        </button>

        {/* Backspace Delete */}
        <button
          type="button"
          disabled={loading || value.length === 0}
          onClick={handleDelete}
          className="h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white font-bold text-sm border border-slate-800 transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none select-none"
        >
          <Delete className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Xóa</span>
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={loading || value.length < maxLength}
        onClick={() => onSubmit(value)}
        className={`w-full mt-4 py-4 px-6 rounded-2xl font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none select-none ${
          actionType === 'CHECK_IN'
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
        }`}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6" />
            <span>
              {mode === 'otp'
                ? actionType === 'CHECK_IN'
                  ? 'XÁC NHẬN CHECK-IN VÀO CA'
                  : 'XÁC NHẬN CHECK-OUT RA CA'
                : mode === 'code'
                ? 'TIẾP TỤC: NHẬP MÃ PIN'
                : 'XÁC NHẬN MÃ PIN'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default PinKeypad;

