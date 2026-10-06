'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Lock, ShoppingBag, Store, Trash2 } from 'lucide-react';
import { useCartTotals, useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { getRelated } from '@/data/products';
import { cn } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyState from './EmptyState';
import ProductGrid from './ProductGrid';
import { BlockSkeleton } from './Skeletons';

export default function CartView() {
  const { hydrated, deliveryMode, dispatch } = useStore();
  const { toast } = useUI();
  const totals = useCartTotals();
  const empty = totals.lines.length === 0;

  if (!hydrated) {
    return (
      <div className="container-page py-8">
        <BlockSkeleton className="h-10 w-64" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]"><BlockSkeleton className="h-96" /><BlockSkeleton className="h-80" /></div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState headingLevel="h1" icon={ShoppingBag} title="Tu carrito está vacío" description="Agrega productos y verás aquí el resumen de tu compra.">
          <Link href="/productos" className="btn btn-primary btn-lg">Seguir comprando</Link>
          <Link href="/ofertas" className="btn btn-outline btn-lg">Ver ofertas</Link>
        </EmptyState>
      </div>
    );
  }

  const first = totals.lines[0].product;
  const suggestions = getRelated(first, 8).filter((p) => !totals.lines.some((l) => l.product.id === p.id)).slice(0, 5);

  const clear = () => {
    dispatch({ type: 'CART_CLEAR' });
    toast({ type: 'info', title: 'Carrito vaciado' });
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Carrito' }]} />
      <h1 className="mt-4 text-[28px] font-extrabold md:text-4xl">Carrito de compras</h1>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="card p-4 sm:p-6" aria-label="Productos en tu carrito">
          <div className="flex items-center justify-between border-b border-ink-100 pb-3">
            <h2 className="text-lg font-extrabold">{totals.count} {totals.count === 1 ? 'producto' : 'productos'}</h2>
            <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-500 hover:text-coral-600">
              <Trash2 size={16} /> Vaciar carrito
            </button>
          </div>
          <ul className="divide-y divide-ink-100">
            {totals.lines.map(({ product, qty }) => (
              <li key={product.id}><CartItem product={product} qty={qty} /></li>
            ))}
          </ul>
          <div className="border-t border-ink-100 pt-4">
            <Link href="/productos" className="inline-flex items-center gap-2 font-bold text-brand-700 hover:underline"><ArrowLeft size={17} /> Seguir comprando</Link>
          </div>
        </section>

        <div className="lg:sticky lg:top-[152px]">
          <OrderSummary totals={totals} mode={deliveryMode}>
            <fieldset className="mb-4">
              <legend className="mb-2 text-sm font-bold text-ink-700">¿Cómo lo recibes?</legend>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-ink-100 p-1">
                {([
                  { id: 'delivery', label: 'Despacho', icon: Home },
                  { id: 'pickup', label: 'Retiro', icon: Store },
                ] as const).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={deliveryMode === o.id}
                    onClick={() => dispatch({ type: 'SET_MODE', mode: o.id })}
                    className={cn('inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold transition', deliveryMode === o.id ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800')}
                  >
                    <o.icon size={16} /> {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <Link href="/checkout" className="btn btn-primary btn-lg w-full">Continuar compra</Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-500"><Lock size={13} /> Compra protegida · Demostración sin pagos reales</p>
          </OrderSummary>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-12" aria-labelledby="sugeridos">
          <h2 id="sugeridos" className="text-2xl font-extrabold">Te puede interesar</h2>
          <div className="mt-5"><ProductGrid products={suggestions} /></div>
        </section>
      )}
    </div>
  );
}
