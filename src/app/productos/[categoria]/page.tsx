import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CatalogView from '@/components/CatalogView';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { categories, getCategory } from '@/data/categories';

type Props = { params: Promise<{ categoria: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const c = getCategory(categoria);
  if (!c) return { title: 'Categoría no encontrada' };
  return {
    title: c.name,
    description: `${c.tagline}. Compra ${c.name.toLowerCase()} en MIXMARKET con despacho a domicilio o retiro en tienda.`,
    alternates: { canonical: `/productos/${c.slug}` },
    openGraph: { title: `${c.name} | MIXMARKET`, description: c.tagline },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  if (!getCategory(categoria)) notFound();
  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton count={8} /></div>}>
      <CatalogView categoria={categoria} />
    </Suspense>
  );
}
