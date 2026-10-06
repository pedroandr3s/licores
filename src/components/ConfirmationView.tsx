'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Copy, MapPin, Package, Store, Truck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { getProduct } from '@/data/products';
import { getStore } from '@/data/stores';
import { deliveryLabel } from '@/lib/orders';
import { formatISOLong } from '@/lib/dates';
import { formatCLP } from '@/lib/format';
import ProductImage from './ProductImage';
import EmptyState from './EmptyState';
import { BlockSkeleton } from './Skeletons';

export default function ConfirmationView() {
  const sp = useSearchParams();
  const id = sp.get('pedido');
  const { orders, hydrated, user } = useStore();
  const { toast } = useUI();
  const order = orders.find((o) => o.id === id);

  if (!hydrated) {
    return <div className="container-page py-10"><BlockSkeleton className="mx-auto h-96 max-w-3xl" /></div>;
  }

  if (!order) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState headingLevel="h1" icon={Package} title="No encontramos tu pedido" description="Puede que el enlace esté incompleto. Revisa tus pedidos para encontrarlo.">
          <Link href="/mis-pedidos" className="btn btn-primary">Ver mis pedidos</Link>
          <Link href="/productos" className="btn btn-outline">Seguir comprando</Link>
        </EmptyState>
      </div>
    );
  }

  const pickup = order.delivery.mode === 'pickup';
  const store = getStore(order.delivery.storeId);
  const a = order.delivery.address;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      toast({ type: 'success', title: 'Número de pedido copiado', description: order.id });
    } catch {
      toast({ type: 'info', title: 'No pudimos copiar', description: 'Selecciona y copia el número manualmente.' });
    }
  };

  return (
    <div className="container-page py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <svg viewBox="0 0 96 96" className="mx-auto h-24 w-24" aria-hidden>
            <circle cx="48" cy="48" r="44" className="animate-ring-grow" fill="#12b27a" style={{ transformOrigin: '48px 48px' }} />
            <path d="M28 49 l14 14 l27 -30" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="48" className="animate-check-draw" />
          </svg>
          <h1 className="mt-5 text-[32px] font-extrabold md:text-5xl">¡Compra realizada!</h1>
          <p className="mt-2 text-lg text-ink-600">Tu pedido ha sido creado correctamente.</p>
          <p className="mt-1 text-sm text-ink-500">Demostración: no se realizó ningún cobro real.</p>
        </div>

        <div className="card mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-600 px-5 py-4 text-white sm:px-7">
            <div>
              <p className="text-sm text-brand-100">Número de pedido</p>
              <p className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{order.id}</p>
            </div>
            <button type="button" onClick={copy} className="btn btn-sm bg-white/15 text-white hover:bg-white/25"><Copy size={15} /> Copiar</button>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold">{pickup ? <Store size={19} className="text-brand-600" /> : <Truck size={19} className="text-brand-600" />} {deliveryLabel(order.delivery.mode)}</h2>
              <div className="mt-2 space-y-1 text-[15px] text-ink-700">
                {pickup && store ? (
                  <>
                    <p className="font-bold">{store.name}</p>
                    <p className="flex items-start gap-1.5"><MapPin size={15} className="mt-1 shrink-0 text-ink-400" /> {store.address}</p>
                    <p className="text-ink-500">{store.hoursLabel}</p>
                  </>
                ) : (
                  a && (
                    <>
                      <p className="flex items-start gap-1.5"><MapPin size={15} className="mt-1 shrink-0 text-ink-400" /> {a.street} {a.number}{a.apartment ? `, ${a.apartment}` : ''}</p>
                      <p className="pl-[21px]">{a.comuna}, {a.region}</p>
                    </>
                  )
                )}
              </div>
              <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800">
                {pickup ? 'Retiro estimado:' : 'Entrega estimada:'} {formatISOLong(order.delivery.date)}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Pago</h2>
              <p className="mt-2 text-[15px] text-ink-700">{order.payment.label}</p>
              <p className="mt-1 text-[15px] text-ink-500">{order.customer.name} {order.customer.lastName} · {order.customer.email}</p>
              {user && <p className="mt-3 rounded-lg bg-sun-100 px-3 py-2 text-sm font-semibold text-[#8a5a00]">Sumaste {order.pointsEarned.toLocaleString('es-CL')} puntos del Club MIXMARKET</p>}
            </div>
          </div>

          <div className="border-t border-ink-100 px-5 py-2 sm:px-7">
            <h2 className="sr-only">Productos</h2>
            <ul className="divide-y divide-ink-100">
              {order.items.map((i) => {
                const p = getProduct(i.productId);
                return (
                  <li key={i.productId} className="flex items-center gap-3.5 py-3.5">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100">{p && <ProductImage product={p} className="h-full w-full" alt="" />}</span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug"><span className="line-clamp-2">{i.name}</span><span className="text-sm font-normal text-ink-500">{i.qty} × {formatCLP(i.price)}</span></span>
                    <span className="font-bold">{formatCLP(i.price * i.qty)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <dl className="space-y-1.5 border-t border-ink-100 bg-ink-50/60 px-5 py-5 text-[15px] sm:px-7">
            <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="font-semibold">{formatCLP(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-600">Descuentos</dt><dd className="font-semibold text-mint-700">-{formatCLP(order.discounts)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-600">{pickup ? 'Retiro' : 'Despacho'}</dt><dd className="font-semibold">{order.shipping === 0 ? 'Gratis' : formatCLP(order.shipping)}</dd></div>
            <div className="flex items-end justify-between pt-2"><dt className="text-lg font-extrabold">Total</dt><dd className="font-display text-3xl font-extrabold">{formatCLP(order.total)}</dd></div>
          </dl>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href={`/mis-pedidos/${order.id}`} className="btn btn-primary btn-lg">Ver mi pedido</Link>
          <Link href="/productos" className="btn btn-outline btn-lg">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
