'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

export interface ToastItem {
  id: number;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export type ToastInput = Omit<ToastItem, 'id'>;

interface UIValue {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  loginOpen: boolean;
  loginMode: 'login' | 'register';
  loginRedirect: string | null;
  openLogin: (mode?: 'login' | 'register', redirect?: string) => void;
  closeLogin: () => void;
  storeModalOpen: boolean;
  openStoreModal: () => void;
  closeStoreModal: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  toasts: ToastItem[];
  toast: (t: ToastInput) => void;
  dismissToast: (id: number) => void;
}

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginRedirect, setLoginRedirect] = useState<string | null>(null);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: ToastInput) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), t.action ? 5500 : 3800);
    },
    [dismissToast],
  );

  const value = useMemo<UIValue>(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      loginOpen,
      loginMode,
      loginRedirect,
      openLogin: (mode = 'login', redirect) => {
        setLoginMode(mode);
        setLoginRedirect(redirect ?? null);
        setLoginOpen(true);
      },
      closeLogin: () => setLoginOpen(false),
      storeModalOpen,
      openStoreModal: () => setStoreModalOpen(true),
      closeStoreModal: () => setStoreModalOpen(false),
      menuOpen,
      setMenuOpen,
      toasts,
      toast,
      dismissToast,
    }),
    [cartOpen, loginOpen, loginMode, loginRedirect, storeModalOpen, menuOpen, toasts, toast, dismissToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de <UIProvider>');
  return ctx;
}
