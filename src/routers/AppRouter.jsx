import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useKiosk } from '@/shared/context/KioskContext';
import { ROUTES } from '@/shared/constants/routes';

// Lazy load Kiosk Pages
const KioskLoginPage = lazy(() => import('@/modules/auth/pages/KioskLoginPage'));
const KioskCheckInPage = lazy(() => import('@/modules/attendance/pages/KioskCheckInPage'));

// Protected Route Guard for Kiosk Activation
const KioskGuard = ({ children }) => {
  const { isAuthenticated } = useKiosk();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

const Loading = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
    <span className="text-sm font-bold text-slate-300">Đang tải giao diện Kiosk...</span>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<KioskLoginPage />} />
          <Route
            path={ROUTES.CHECKIN}
            element={
              <KioskGuard>
                <KioskCheckInPage />
              </KioskGuard>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.CHECKIN} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
