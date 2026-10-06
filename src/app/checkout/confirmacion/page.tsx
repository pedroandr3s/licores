import { Suspense } from 'react';
import type { Metadata } from 'next';
import ConfirmationView from '@/components/ConfirmationView';
import { BlockSkeleton } from '@/components/Skeletons';

export const metadata: Metadata = {
  title: '¡Compra realizada!',
  description: 'Tu pedido en MIXMARKET fue creado correctamente.',
  robots: { index: false, follow: false },
};

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div className="container-page py-10"><BlockSkeleton className="mx-auto h-96 max-w-3xl" /></div>}>
      <ConfirmationView />
    </Suspense>
  );
}
