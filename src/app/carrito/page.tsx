import type { Metadata } from 'next';
import CartView from '@/components/CartView';

export const metadata: Metadata = {
  title: 'Carrito de compras',
  description: 'Revisa los productos de tu carrito, modifica cantidades y continúa tu compra en Oasis.',
  robots: { index: false, follow: true },
};

export default function CarritoPage() {
  return <CartView />;
}
