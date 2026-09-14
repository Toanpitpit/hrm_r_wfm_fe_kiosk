import { useState } from 'react';
import { useKiosk } from '@/shared/context/KioskContext';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { KIOSK_MESSAGES } from '@/shared/constants/message.constants';

export const useKioskLogin = () => {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginKiosk } = useKiosk();
  const navigate = useNavigate();

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      setError(KIOSK_MESSAGES.ENTER_ACTIVATION_CODE);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.activateKiosk(activationCode);
      if (res.success && res.data) {
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
        setError(res.message || KIOSK_MESSAGES.INVALID_ACTIVATION_CODE);
      }
    } catch (err) {
      setError(KIOSK_MESSAGES.ACTIVATION_NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return {
    activationCode,
    setActivationCode,
    loading,
    error,
    handleActivate,
  };
};

export default useKioskLogin;
