'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCartTotals, useStore } from '@/context/StoreContext';
import { formatCLP } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import Drawer from './ui/Drawer';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { deliveryMode } = useStore();
  const totals = useCartTotals();
  const empty = totals.lines.length === 0;
  const pct = Math.min(100, Math.round((totals.itemsTotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <Drawer
      open={cartOpen}
      onClose={closeCart}
      title={`Tu carrito${totals.count ? ` (${totals.count})` : ''}`}
      footer={
        !empty && (
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="font-semibold text-ink-600">Subtotal</span>
              <span className="font-display text-2xl font-extrabold">{formatCLP(totals.itemsTotal)}</span>
            </div>
            <p className="text-xs text-ink-500">El despacho se calcula en el siguiente paso.</p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/carrito" onClick={closeCart} className="btn btn-outline">Ver carrito</Link>
              <Link href="/checkout" onClick={closeCart} className="btn btn-primary">Continuar compra</Link>
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600"><ShoppingBag size={36} strokeWidth={1.75} /></span>
          <h3 className="mt-5 text-xl font-extrabold">Tu carrito está vacío</h3>
          <p className="mt-1.5 text-ink-500">Agrega productos para verlos aquí.</p>
          <Link href="/productos" onClick={closeCart} className="btn btn-primary mt-6">Seguir comprando</Link>
        </div>
      ) : (
        <div className="px-5">
          {deliveryMode === 'delivery' && !totals.shippingIsFree && (
            <div className="mt-4 rounded-xl bg-brand-50 p-3.5">
              <p className="text-sm font-semibold text-brand-800">Te faltan {formatCLP(totals.freeShippingRemaining)} para despacho gratis</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
          )}
          {deliveryMode === 'delivery' && totals.shippingIsFree && (
            <p className="mt-4 rounded-xl bg-mint-50 p-3.5 text-sm font-semibold text-mint-700">¡Tu compra tiene despacho gratis!</p>
          )}
          <ul className="divide-y divide-ink-100">
            {totals.lines.map(({ product, qty }) => (
              <li key={product.id}><CartItem product={product} qty={qty} compact onNavigate={closeCart} /></li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
