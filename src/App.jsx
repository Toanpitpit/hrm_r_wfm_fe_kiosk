import React from 'react';
import AppRouter from '@/routers/AppRouter';
import { KioskProvider } from '@/shared/context/KioskContext';

function App() {
  return (
    <KioskProvider>
      <AppRouter />
    </KioskProvider>
  );
}

export default App;
