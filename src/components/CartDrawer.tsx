'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCartTotals } from '@/context/StoreContext';
import { formatCLP } from '@/lib/format';
import Drawer from './ui/Drawer';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const totals = useCartTotals();
  const empty = totals.lines.length === 0;

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
            <p className="text-xs text-ink-500">Solo retiro en tienda · sin costo de despacho.</p>
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
