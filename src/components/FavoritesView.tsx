'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { getProduct } from '@/data/products';
import { useSimulatedLoading } from '@/hooks/useMounted';
import { useCartActions } from '@/hooks/useCartActions';
import Breadcrumbs from './Breadcrumbs';
import EmptyState from './EmptyState';
import ProductGrid from './ProductGrid';
import { ProductGridSkeleton } from './Skeletons';
import type { Product } from '@/types';

export default function FavoritesView() {
  const { favorites, hydrated, dispatch } = useStore();
  const { toast } = useUI();
  const { add } = useCartActions();
  const loading = useSimulatedLoading('favs', 350) || !hydrated;
  const list = favorites.map(getProduct).filter((p): p is Product => Boolean(p));

  const addAll = () => {
    let n = 0;
    list.forEach((p) => {
      if (p.stock > 0 && add(p, 1, { silent: true })) n++;
    });
    toast({ type: n ? 'success' : 'info', title: n ? `${n} productos agregados al carrito` : 'No había productos con stock para agregar', action: n ? { label: 'Ver carrito', href: '/carrito' } : undefined });
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Favoritos' }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold md:text-4xl">Favoritos</h1>
          {!loading && list.length > 0 && <p className="mt-1 text-ink-500">{list.length} {list.length === 1 ? 'producto guardado' : 'productos guardados'}</p>}
        </div>
        {!loading && list.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={addAll} className="btn btn-primary"><ShoppingBag size={18} /> Agregar todo al carrito</button>
            <button type="button" onClick={() => { dispatch({ type: 'FAV_CLEAR' }); toast({ type: 'info', title: 'Favoritos vaciados' }); }} className="btn btn-outline"><Trash2 size={17} /> Vaciar</button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <ProductGridSkeleton count={5} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5" />
        ) : list.length === 0 ? (
          <EmptyState icon={Heart} title="No tienes productos favoritos todavía." description="Toca el corazón en cualquier producto para guardarlo aquí.">
            <Link href="/productos" className="btn btn-primary">Explorar productos</Link>
            <Link href="/ofertas" className="btn btn-outline">Ver ofertas</Link>
          </EmptyState>
        ) : (
          <ProductGrid products={list} />
        )}
      </div>
    </div>
  );
}
