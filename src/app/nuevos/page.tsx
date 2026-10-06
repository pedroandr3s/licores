import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogView from '@/components/CatalogView';
import { ProductGridSkeleton } from '@/components/Skeletons';

export const metadata: Metadata = {
  title: 'Novedades',
  description: 'Los productos más nuevos de Botillería Oasis: lo último que llegó al local.',
  alternates: { canonical: '/nuevos' },
};

export default function NuevosPage() {
  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton count={8} /></div>}>
      <CatalogView mode="new" />
    </Suspense>
  );
}
