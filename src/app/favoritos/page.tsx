import type { Metadata } from 'next';
import FavoritesView from '@/components/FavoritesView';

export const metadata: Metadata = {
  title: 'Favoritos',
  description: 'Los productos que guardaste en MIXMARKET.',
  robots: { index: false, follow: false },
};

export default function FavoritosPage() {
  return <FavoritesView />;
}
