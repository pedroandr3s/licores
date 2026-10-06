import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogView from '@/components/CatalogView';
import { ProductGridSkeleton } from '@/components/Skeletons';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora todo el catálogo de MIXMARKET: perfumería, cuidado personal, limpieza, hogar, tecnología, snacks, bebidas, mascotas, belleza e infantil.',
  alternates: { canonical: '/productos' },
  openGraph: { title: 'Productos | MIXMARKET', description: 'Todo el catálogo MIXMARKET con filtros por precio, marca y disponibilidad.' },
};

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton count={8} /></div>}>
      <CatalogView />
    </Suspense>
  );
}
