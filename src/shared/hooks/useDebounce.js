import { useState, useEffect } from 'react';

/**
 * Custom Hook debounce giá trị input sau N miliseconds (Mặc định: 2000ms = 2 giây).
 * @param {*} value - Giá trị cần debounce (ví dụ: chuỗi mã NV người dùng nhập)
 * @param {number} [delay=2000] - Khoảng thời gian chờ sau khi dừng nhập (ms)
 * @returns {*} Giá trị đã được debounce
 */
export function useDebounce(value, delay = 2000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
