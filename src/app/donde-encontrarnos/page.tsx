import type { Metadata } from 'next';
import StoresView from '@/components/StoresView';

export const metadata: Metadata = {
  title: 'Dónde encontrarnos',
  description: 'Botillería Oasis: Avenida Prat 813, Quirihue. Horarios, cómo llegar y condiciones de retiro. Venta solo a mayores de 18 años.',
  alternates: { canonical: '/donde-encontrarnos' },
};

export default function TiendasPage() {
  return <StoresView />;
}
