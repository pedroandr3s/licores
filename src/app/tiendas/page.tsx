import type { Metadata } from 'next';
import StoresView from '@/components/StoresView';

export const metadata: Metadata = {
  title: 'Tiendas',
  description: 'Encuentra las tiendas MIXMARKET en San Carlos, Chillán, Bulnes y Yungay: horarios, direcciones y servicios de retiro.',
  alternates: { canonical: '/tiendas' },
};

export default function TiendasPage() {
  return <StoresView />;
}
