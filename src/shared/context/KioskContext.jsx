import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import axiosInstance from '@/config/axios.config';
import { API_ENDPOINTS } from '@/config/api.config';

const KioskContext = createContext(null);

export const KioskProvider = ({ children }) => {
  const [kioskToken, setKioskToken] = useState(() => localStorage.getItem(STORAGE_KEYS.KIOSK_TOKEN) || null);
  const [storeInfo, setStoreInfo] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORE_INFO);
    return saved ? JSON.parse(saved) : { storeName: 'Cửa Hàng Chi Nhánh 01', terminalId: 'KIOSK-MAIN' };
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loginKiosk = (token, storeData) => {
    localStorage.setItem(STORAGE_KEYS.KIOSK_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(storeData));
    setKioskToken(token);
    setStoreInfo(storeData);
  };

  const logoutKiosk = async () => {
    if (kioskToken) {
      try {
        await axiosInstance.post(API_ENDPOINTS.AUTH.UNPAIR, { deviceToken: kioskToken });
      } catch (err) {
        console.warn('Không thể gửi thông báo hủy ghép nối tới Backend:', err);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.KIOSK_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.STORE_INFO);
    setKioskToken(null);
  };

  return (
    <KioskContext.Provider
      value={{
        kioskToken,
        storeInfo,
        isOnline,
        loginKiosk,
        logoutKiosk,
        isAuthenticated: !!kioskToken,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk phải được dùng bên trong KioskProvider');
  }
  return context;
};
