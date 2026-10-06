'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { UIProvider } from '@/context/UIContext';
import CartDrawer from './CartDrawer';
import LoginModal from './LoginModal';
import StoreModal from './StoreModal';
import ToastViewport from './Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <UIProvider>
        {children}
        <CartDrawer />
        <LoginModal />
        <StoreModal />
        <ToastViewport />
      </UIProvider>
    </StoreProvider>
  );
}
