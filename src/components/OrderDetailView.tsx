'use client';

import Link from 'next/link';
import { Check, CreditCard, FastForward, HelpCircle, IdCard, MapPin, Package, PackageCheck, Phone, Receipt, RotateCcw, Store } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { getProduct } from '@/data/products';
import { getStore } from '@/data/stores';
import { nextStatus, STATUS_FLOW, STATUS_LABEL } from '@/lib/orders';
import { formatDateTime, formatISOLong } from '@/lib/dates';
import { formatCLP, cn } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import ProductImage from './ProductImage';
import EmptyState from './EmptyState';
import { StatusBadge } from './OrderCard';
import { BlockSkeleton } from './Skeletons';

const STATUS_ICON: Record<OrderStatus, typeof Package> = {
  received: Receipt,
  preparing: Package,
  ready: Store,
  delivered: PackageCheck,
};

export default function OrderDetailView({ id }: { id: string }) {
  const { orders, hydrated, dispatch } = useStore();
  const { toast } = useUI();
  const order = orders.find((o) => o.id === id);

  if (!hydrated) {
    return <div className="container-page py-8"><BlockSkeleton className="h-10 w-72" /><BlockSkeleton className="mt-6 h-72" /></div>;
  }

  if (!order) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState headingLevel="h1" icon={Package} title="No encontramos este pedido" description={`No hay un pedido con el número ${id}. Revisa que esté bien escrito.`}>
          <Link href="/mis-pedidos" className="btn btn-primary">Ver mis pedidos</Link>
        </EmptyState>
      </div>
    );
  }

  const flow = STATUS_FLOW;
  const current = flow.indexOf(order.status);
  const next = nextStatus(order);
  const store = getStore(order.pickup.storeId);
  const hasAlcohol = order.items.some((i) => getProduct(i.productId)?.isAlcohol);

  const reorder = () => {
    order.items.forEach((i) => dispatch({ type: 'CART_ADD', productId: i.productId, qty: i.qty }));
    toast({ type: 'success', title: 'Productos agregados al carrito', description: `Pedido ${order.id}`, action: { label: 'Ver carrito', href: '/carrito' } });
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Mis pedidos', href: '/mis-pedidos' }, { label: order.id }]} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold md:text-4xl">Pedido {order.id}</h1>
          <p className="mt-1 text-ink-500">Realizado el {formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Línea de tiempo */}
      <section className="card mt-6 p-5 sm:p-7" aria-label="Estado del pedido">
        <ol className="grid grid-cols-4 gap-2">
          {flow.map((s, i) => {
            const Icon = STATUS_ICON[s];
            const done = i < current;
            const active = i === current;
            return (
              <li key={s} className="relative flex flex-col items-center text-center" aria-current={active ? 'step' : undefined}>
                {i > 0 && <span aria-hidden className={cn('absolute right-1/2 top-5 h-1 w-full rounded-full', i <= current ? 'bg-mint-500' : 'bg-ink-100')} />}
                <span className={cn('relative z-10 grid h-10 w-10 place-items-center rounded-full ring-4 ring-white', done && 'bg-mint-500 text-white', active && 'bg-brand-600 text-white', !done && !active && 'bg-ink-100 text-ink-400')}>
                  {done ? <Check size={20} strokeWidth={3} /> : <Icon size={19} />}
                </span>
                <span className={cn('mt-2 text-[13px] font-bold leading-tight sm:text-sm', active ? 'text-brand-700' : done ? 'text-ink-800' : 'text-ink-400')}>{STATUS_LABEL[s]}</span>
              </li>
            );
          })}
        </ol>
        {next && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-50 p-4">
            <p className="text-sm text-ink-600">Demostración: avanza el pedido al siguiente estado para ver cómo cambia.</p>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'ORDER_STATUS', id: order.id, status: next });
                toast({ type: 'info', title: `Estado: ${STATUS_LABEL[next]}`, description: order.id });
              }}
              className="btn btn-outline btn-sm"
            >
              <FastForward size={16} /> Simular: {STATUS_LABEL[next]}
            </button>
          </div>
        )}
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="card p-4 sm:p-6" aria-label="Productos del pedido">
          <h2 className="text-xl font-extrabold">Productos ({order.items.reduce((s, i) => s + i.qty, 0)})</h2>
          <ul className="mt-2 divide-y divide-ink-100">
            {order.items.map((i) => {
              const p = getProduct(i.productId);
              return (
                <li key={i.productId} className="flex items-center gap-4 py-4">
                  <Link href={`/producto/${i.productId}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100">
                    {p && <ProductImage product={p} className="h-full w-full" alt={i.name} />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-ink-500">{i.brand}</p>
                    <Link href={`/producto/${i.productId}`} className="line-clamp-2 font-bold leading-snug hover:text-brand-700">{i.name}</Link>
                    <p className="mt-1 text-sm text-ink-500">{i.qty} × {formatCLP(i.price)}</p>
                  </div>
                  <p className="font-display text-lg font-extrabold">{formatCLP(i.price * i.qty)}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><Store size={20} className="text-brand-600" /> Retiro en tienda</h2>
            <div className="mt-3 space-y-1.5 text-[15px] text-ink-700">
              {store && (
                <>
                  <p className="font-bold">{store.name}</p>
                  <p className="flex items-start gap-2"><MapPin size={16} className="mt-1 shrink-0 text-ink-400" /> {store.address}</p>
                  <p className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-ink-400" /> {store.phone}</p>
                  <p className="text-ink-500">{store.hoursLabel}</p>
                </>
              )}
              <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800">
                {order.status === 'delivered' ? 'Retirado el' : 'Retiro:'} {formatISOLong(order.pickup.date)}
              </p>
              {hasAlcohol && order.status !== 'delivered' && (
                <p className="flex items-start gap-2 rounded-lg bg-sun-100 px-3 py-2 text-sm font-semibold text-[#6b4700]">
                  <IdCard size={16} className="mt-0.5 shrink-0" /> Presenta tu cédula: solo entregamos alcohol a mayores de 18 años.
                </p>
              )}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><CreditCard size={20} className="text-brand-600" /> Pago</h2>
            <p className="mt-2 text-[15px] text-ink-700">{order.payment.label}</p>
            <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-[15px]">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="font-semibold">{formatCLP(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Descuentos</dt><dd className="font-semibold text-mint-700">-{formatCLP(order.discounts)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Retiro en tienda</dt><dd className="font-semibold text-mint-700">Gratis</dd></div>
              <div className="flex items-end justify-between border-t border-ink-100 pt-3"><dt className="font-extrabold">Total</dt><dd className="font-display text-2xl font-extrabold">{formatCLP(order.total)}</dd></div>
            </dl>
            <p className="mt-3 text-sm text-ink-500">Con este pedido sumaste {order.pointsEarned.toLocaleString('es-CL')} puntos del Club.</p>
          </section>

          <div className="grid gap-3">
            <button type="button" onClick={reorder} className="btn btn-primary"><RotateCcw size={17} /> Volver a comprar</button>
            <Link href="/ayuda/contacto" className="btn btn-outline"><HelpCircle size={17} /> Necesito ayuda con mi pedido</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
