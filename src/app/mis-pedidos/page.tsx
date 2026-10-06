import type { Metadata } from 'next';
import OrdersView from '@/components/OrdersView';

export const metadata: Metadata = {
  title: 'Mis pedidos',
  description: 'Consulta el estado de tus pedidos en Oasis.',
  robots: { index: false, follow: false },
};

export default function MisPedidosPage() {
  return <OrdersView />;
}
