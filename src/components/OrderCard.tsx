import Link from 'next/link';
import { ArrowRight, MapPin, Store, Truck } from 'lucide-react';
import type { Order } from '@/types';
import { getProduct } from '@/data/products';
import { getStore } from '@/data/stores';
import { deliveryLabel, STATUS_LABEL, STATUS_STYLE } from '@/lib/orders';
import { formatDateOnly, formatISOShort } from '@/lib/dates';
import { formatCLP } from '@/lib/format';
import ProductImage from './ProductImage';

export function StatusBadge({ status }: { status: Order['status'] }) {
  return <span className={`badge px-2.5 py-1 text-[13px] ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

export default function OrderCard({ order }: { order: Order }) {
  const items = order.items.slice(0, 4);
  const extra = order.items.length - items.length;
  const units = order.items.reduce((a, i) => a + i.qty, 0);
  const store = getStore(order.delivery.storeId);
  const pickup = order.delivery.mode === 'pickup';
  return (
    <article className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink-100 bg-ink-50/70 px-4 py-3.5 sm:px-6">
        <div>
          <p className="text-xs font-semibold text-ink-500">Pedido</p>
          <p className="font-display text-lg font-extrabold">{order.id}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500">Fecha</p>
          <p className="font-bold">{formatDateOnly(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500">Total</p>
          <p className="font-bold">{formatCLP(order.total)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <ul className="flex -space-x-3">
            {items.map((i) => {
              const p = getProduct(i.productId);
              return (
                <li key={i.productId} className="h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-ink-50 shadow-sm">
                  {p && <ProductImage product={p} className="h-full w-full" alt={i.name} />}
                </li>
              );
            })}
            {extra > 0 && <li className="grid h-16 w-16 place-items-center rounded-xl border-2 border-white bg-ink-100 text-sm font-extrabold text-ink-600 shadow-sm">+{extra}</li>}
          </ul>
          <div className="leading-snug">
            <p className="font-bold">{units} {units === 1 ? 'producto' : 'productos'}</p>
            <p className="flex items-center gap-1.5 text-sm text-ink-600">
              {pickup ? <Store size={14} /> : <Truck size={14} />} {deliveryLabel(order.delivery.mode)}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin size={14} />
              {pickup ? store?.name : `${order.delivery.address?.comuna}`} · {order.status === 'delivered' ? 'Entregado el' : pickup ? 'Retiro:' : 'Llega:'} {formatISOShort(order.delivery.date)}
            </p>
          </div>
        </div>
        <Link href={`/mis-pedidos/${order.id}`} className="btn btn-outline shrink-0 sm:ml-4">
          Ver detalle <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
