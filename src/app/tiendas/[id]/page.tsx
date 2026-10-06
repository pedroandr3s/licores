import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoreDetail from '@/components/StoreDetail';
import { getStore, stores } from '@/data/stores';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return stores.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = getStore(id);
  if (!s) return { title: 'Tienda no encontrada' };
  return { title: s.name, description: `${s.name}: ${s.address}. ${s.hoursLabel}.`, alternates: { canonical: `/tiendas/${s.id}` } };
}

export default async function TiendaPage({ params }: Props) {
  const { id } = await params;
  const store = getStore(id);
  if (!store) notFound();
  return <StoreDetail store={store} />;
}
