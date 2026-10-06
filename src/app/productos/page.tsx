import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogView from '@/components/CatalogView';
import { ProductGridSkeleton } from '@/components/Skeletons';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Catálogo de Botillería Oasis: cervezas, vinos, destilados, licores, bebidas y papas fritas. Retiro en tienda en Quirihue.',
  alternates: { canonical: '/productos' },
  openGraph: { title: 'Productos | Botillería Oasis', description: 'Todo el catálogo con filtros por precio, marca y tipo.' },
};

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton count={8} /></div>}>
      <CatalogView />
    </Suspense>
  );
}
