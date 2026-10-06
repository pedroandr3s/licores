import type { Metadata } from 'next';
import CheckoutView from '@/components/CheckoutView';

export const metadata: Metadata = {
  title: 'Finalizar compra',
  description: 'Elige tu día de retiro, completa tus datos y confirma tu pedido en Botillería Oasis.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
