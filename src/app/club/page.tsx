import type { Metadata } from 'next';
import ClubView from '@/components/ClubView';

export const metadata: Metadata = {
  title: 'Club Oasis',
  description: 'Acumula puntos en tus compras y canjéalos por vales y productos.',
  alternates: { canonical: '/club' },
};

export default function ClubPage() {
  return <ClubView />;
}
