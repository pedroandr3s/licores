'use client';

import { Gift, Truck } from 'lucide-react';
import type { DeliveryMode } from '@/types';
import type { PricedLine, Totals } from '@/lib/pricing';
import { formatCLP } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import ProductImage from './ProductImage';
import type { ReactNode } from 'react';

interface Props {
  lines?: PricedLine[];
  totals: Totals;
  mode: DeliveryMode;
  showItems?: boolean;
  showProgress?: boolean;
  children?: ReactNode;
  title?: string;
}

export function SummaryRows({ totals, mode }: { totals: Totals; mode: DeliveryMode }) {
  return (
    <dl className="space-y-2.5 text-[15px]">
      <div className="flex justify-between">
        <dt className="text-ink-600">Subtotal ({totals.count} {totals.count === 1 ? 'producto' : 'productos'})</dt>
        <dd className="font-semibold">{formatCLP(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-600">Descuentos</dt>
        <dd className="font-semibold text-mint-700">{totals.discounts > 0 ? `-${formatCLP(totals.discounts)}` : formatCLP(0)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-600">{mode === 'pickup' ? 'Retiro en tienda' : 'Despacho'}</dt>
        <dd className={`font-semibold ${totals.shipping === 0 ? 'text-mint-700' : ''}`}>{totals.shipping === 0 ? 'Gratis' : formatCLP(totals.shipping)}</dd>
      </div>
      <div className="flex items-end justify-between border-t border-ink-100 pt-3.5">
        <dt className="text-base font-extrabold">Total</dt>
        <dd className="font-display text-[28px] font-extrabold leading-none">{formatCLP(totals.total)}</dd>
      </div>
    </dl>
  );
}

export default function OrderSummary({ lines, totals, mode, showItems, showProgress = true, children, title = 'Resumen de tu compra' }: Props) {
  const showBar = showProgress && mode === 'delivery' && !totals.shippingIsFree && totals.count > 0;
  const pct = Math.min(100, Math.round((totals.itemsTotal / FREE_SHIPPING_THRESHOLD) * 100));
  return (
    <section className="card p-5 sm:p-6" aria-label={title}>
      <h2 className="text-xl font-extrabold">{title}</h2>

      {showItems && lines && (
        <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto border-b border-ink-100 pb-4 pr-1">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex items-center gap-3">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50 ring-1 ring-ink-100">
                <ProductImage product={product} className="h-full w-full" />
                <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-ink-900 px-1 text-[11px] font-bold text-white">{qty}</span>
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold leading-snug"><span className="line-clamp-2">{product.name}</span></span>
              <span className="text-sm font-bold">{formatCLP(product.price * qty)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={showItems ? 'mt-4' : 'mt-5'}>
        <SummaryRows totals={totals} mode={mode} />
      </div>

      {totals.discounts > 0 && (
        <p className="mt-3 rounded-xl bg-mint-50 px-3.5 py-2.5 text-sm font-semibold text-mint-700">
          Estás ahorrando {formatCLP(totals.discounts + 0)} en esta compra
        </p>
      )}

      {showBar && (
        <div className="mt-4 rounded-xl bg-brand-50 p-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
            <Truck size={16} /> Te faltan {formatCLP(totals.freeShippingRemaining)} para despacho gratis
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      {mode === 'delivery' && totals.shippingIsFree && totals.count > 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-mint-50 px-3.5 py-2.5 text-sm font-semibold text-mint-700">
          <Gift size={16} /> ¡Tienes despacho gratis!
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
