'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import type { Product } from '@/types';
import { maxQty } from '@/data/products';
import { formatCLP } from '@/lib/format';
import { useCartActions } from '@/hooks/useCartActions';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import ProductImage from './ProductImage';
import QuantitySelector from './QuantitySelector';

interface Props {
  product: Product;
  qty: number;
  compact?: boolean;
  onNavigate?: () => void;
}

export default function CartItem({ product, qty, compact, onNavigate }: Props) {
  const { setQty, remove } = useCartActions();
  const { favorites, dispatch } = useStore();
  const { toast } = useUI();
  const max = maxQty(product);
  const href = `/producto/${product.id}`;
  const isFav = favorites.includes(product.id);

  const saveForLater = () => {
    if (!isFav) dispatch({ type: 'FAV_TOGGLE', productId: product.id });
    dispatch({ type: 'CART_REMOVE', productId: product.id });
    toast({ type: 'success', title: 'Guardado en favoritos', description: product.name, action: { label: 'Ver favoritos', href: '/favoritos' } });
  };

  return (
    <div className={compact ? 'flex gap-3 py-3.5' : 'flex gap-3 py-4 sm:gap-5 sm:py-5'}>
      <Link
        href={href}
        onClick={onNavigate}
        className={`shrink-0 overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100 ${compact ? 'h-[76px] w-[76px]' : 'h-[88px] w-[88px] sm:h-[120px] sm:w-[120px]'}`}
      >
        <ProductImage product={product} className="h-full w-full" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-ink-500">{product.brand}</p>
            <Link href={href} onClick={onNavigate} className={`line-clamp-2 font-bold leading-snug text-ink-900 hover:text-brand-700 ${compact ? 'text-sm' : 'text-[15px] sm:text-base'}`}>
              {product.name}
            </Link>
          </div>
          {!compact && (
            <p className="hidden shrink-0 text-right font-display text-xl font-extrabold sm:block">{formatCLP(product.price * qty)}</p>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-bold text-ink-900">{formatCLP(product.price)}</span>
          {product.discount > 0 && <span className="text-ink-400 line-through">{formatCLP(product.originalPrice)}</span>}
          {product.discount > 0 && <span className="text-xs font-extrabold text-coral-600">-{product.discount}%</span>}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2.5">
          <QuantitySelector value={qty} min={1} max={max} size="sm" onChange={(n) => setQty(product.id, n)} label={`Cantidad de ${product.name}`} />
          <div className="flex items-center gap-1">
            {compact && <span className="mr-1 font-display text-base font-extrabold">{formatCLP(product.price * qty)}</span>}
            {!compact && (
              <button type="button" onClick={saveForLater} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-ink-500 hover:bg-ink-100 hover:text-brand-700">
                <Heart size={16} /> <span className="hidden sm:inline">Guardar</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(product)}
              aria-label={`Eliminar ${product.name} del carrito`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-ink-500 hover:bg-coral-50 hover:text-coral-600"
            >
              <Trash2 size={16} /> {!compact && <span className="hidden sm:inline">Eliminar</span>}
            </button>
          </div>
        </div>
        {qty >= max && max < 10 && <p className="mt-1.5 text-xs font-semibold text-coral-600">Stock máximo alcanzado ({max} un.)</p>}
        {!compact && (
          <p className="mt-2 text-right font-display text-lg font-extrabold sm:hidden">{formatCLP(product.price * qty)}</p>
        )}
      </div>
    </div>
  );
}
