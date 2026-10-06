import type { Metadata } from 'next';
import OffersView from '@/components/OffersView';

export const metadata: Metadata = {
  title: 'Ofertas',
  description: 'Ofertas flash y descuentos de hasta 70% en perfumería, tecnología, hogar, limpieza y más en MIXMARKET.',
  alternates: { canonical: '/ofertas' },
  openGraph: { title: 'Ofertas de hasta 70% | MIXMARKET', description: 'Ofertas flash por tiempo limitado.' },
};

export default function OfertasPage() {
  return <OffersView />;
}
