import type { Metadata } from 'next';
import ClubView from '@/components/ClubView';

export const metadata: Metadata = {
  title: 'Club MIXMARKET',
  description: 'Acumula puntos en tus compras y canjéalos por vales, despachos gratis y productos exclusivos.',
  alternates: { canonical: '/club' },
};

export default function ClubPage() {
  return <ClubView />;
}
