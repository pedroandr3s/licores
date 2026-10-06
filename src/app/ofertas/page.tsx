import type { Metadata } from 'next';
import OffersView from '@/components/OffersView';

export const metadata: Metadata = {
  title: 'Ofertas',
  description: 'Ofertas en cervezas, vinos, destilados y snacks en Botillería Oasis, Quirihue. Retiro en tienda.',
  alternates: { canonical: '/ofertas' },
  openGraph: { title: 'Ofertas | Botillería Oasis', description: 'Ofertas por tiempo limitado.' },
};

export default function OfertasPage() {
  return <OffersView />;
}
