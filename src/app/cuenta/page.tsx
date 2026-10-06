import { Suspense } from 'react';
import type { Metadata } from 'next';
import AccountView from '@/components/AccountView';

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Administra tu perfil en Botillería Oasis.',
  robots: { index: false, follow: false },
};

export default function CuentaPage() {
  return (
    <Suspense fallback={<div className="container-page py-10"><div className="skeleton mx-auto h-72 max-w-2xl" /></div>}>
      <AccountView />
    </Suspense>
  );
}
