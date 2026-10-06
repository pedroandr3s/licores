import type { Metadata } from 'next';
import CheckoutView from '@/components/CheckoutView';

export const metadata: Metadata = {
  title: 'Finalizar compra',
  description: 'Elige despacho o retiro en tienda, completa tus datos y confirma tu pedido en MIXMARKET.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
