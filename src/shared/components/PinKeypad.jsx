import React from 'react';
import { Delete, RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Search, Loader2 } from 'lucide-react';

const PinKeypad = ({
  value,
  onChange,
  onSubmit,
  mode = 'code', // 'code' | 'pin'
  employeeInfo = null,
  maxLength = 6,
  loading = false,
  suggestions = [],
  isSearching = false,
  onSelectSuggestion,
}) => {
  const handleDigit = (digit) => {
    if (mode === 'pin') {
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
      {/* Thông tin Nhân Viên đã xác nhận (Hiện ở Bước 2 nhập PIN) */}
      {mode === 'pin' && employeeInfo && (
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

      {/* Input Display & Search Box */}
      <div className="w-full mb-4 relative z-20">
        <div className="h-16 px-4 bg-slate-900/90 border-2 border-slate-700 focus-within:border-blue-500 rounded-2xl flex items-center justify-between shadow-inner">
          {mode === 'code' ? (
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
          ) : (
            <div className="w-full flex items-center justify-center space-x-3">
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
          )}
        </div>

        {/* Dropdown Gợi Ý Tìm Kiếm Mã NV */}
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

      {/* Touch Keypad Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {keys.map((num) => (
          <button
            key={num}
            type="button"
            disabled={loading}
            onClick={() => handleDigit(num)}
            className="h-14 rounded-2xl bg-slate-800/80 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white font-bold text-2xl shadow-md border border-slate-700/60 transition-all flex items-center justify-center hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            {num}
          </button>
        ))}

        {/* Clear Action */}
        <button
          type="button"
          disabled={loading || value.length === 0}
          onClick={handleClear}
          className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-700/80 active:scale-95 text-slate-400 hover:text-white font-semibold text-sm border border-slate-700/40 transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider">Xóa Hết</span>
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleDigit('0')}
          className="h-14 rounded-2xl bg-slate-800/80 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white font-bold text-2xl shadow-md border border-slate-700/60 transition-all flex items-center justify-center hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          0
        </button>

        {/* Backspace */}
        <button
          type="button"
          disabled={loading || value.length === 0}
          onClick={handleDelete}
          className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-700/80 active:scale-95 text-slate-400 hover:text-white font-semibold text-sm border border-slate-700/40 transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Delete className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider">Xóa</span>
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={loading || value.length === 0}
        onClick={() => onSubmit(value)}
        className="w-full mt-5 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-extrabold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : mode === 'code' ? (
          <>
            <span>TIẾP TỤC: NHẬP MÃ PIN</span>
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>XÁC NHẬN MÃ PIN</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PinKeypad;
