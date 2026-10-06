'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { UIProvider } from '@/context/UIContext';
import AgeGate from './AgeGate';
import CartDrawer from './CartDrawer';
import LoginModal from './LoginModal';
import ToastViewport from './Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <UIProvider>
        {children}
        <CartDrawer />
        <LoginModal />
        <ToastViewport />
        <AgeGate />
      </UIProvider>
    </StoreProvider>
  );
}
