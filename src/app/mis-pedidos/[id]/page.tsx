import type { Metadata } from 'next';
import OrderDetailView from '@/components/OrderDetailView';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Pedido ${id}`, robots: { index: false, follow: false } };
}

export default async function PedidoPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetailView id={id} />;
}
