'use client';

import Link from 'next/link';
import { Flame, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { maxQty } from '@/data/products';
import { brandSlug } from '@/lib/catalog';
import { useCartActions } from '@/hooks/useCartActions';
import ProductImage from './ProductImage';
import FavoriteButton from './FavoriteButton';
import Rating from './Rating';
import PriceTag from './PriceTag';
import QuantitySelector from './QuantitySelector';

export default function ProductCard({ product }: { product: Product }) {
  const { add, setQty, qtyInCart } = useCartActions();
  const qty = qtyInCart(product.id);
  const out = product.stock <= 0;
  const low = !out && product.stock <= 10;
  const href = `/producto/${product.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-shadow duration-200 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-ink-50">
        <Link href={href} aria-label={product.name} className="block h-full w-full">
          <ProductImage
            product={product}
            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.05] ${out ? 'opacity-50 grayscale' : ''}`}
          />
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.discount >= 25 && !out && (
            <span className="badge bg-coral-500 text-white shadow-sm">
              <Flame size={12} /> Oferta
            </span>
          )}
          {product.isNew && !out && <span className="badge bg-sun-400 text-ink-900 shadow-sm">Nuevo</span>}
        </div>

        <FavoriteButton productId={product.id} productName={product.name} className="absolute right-2.5 top-2.5" />

        {product.abv !== undefined && !out && (
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 badge bg-ink-900/85 text-white shadow-sm">
            {String(product.abv).replace('.', ',')}° alc.
          </span>
        )}

        {out && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink-900/80 py-1.5 text-center text-sm font-bold text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <Link href={`/productos?marca=${brandSlug(product.brand)}`} className="w-fit text-xs font-bold text-ink-500 hover:text-brand-700">
          {product.brand}
        </Link>
        <h3 className="min-h-[2.75rem] text-[15px] font-bold leading-snug text-ink-900">
          <Link href={href} className="line-clamp-2 hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-ink-500">{product.volume}</p>
        <Rating rating={product.rating} reviews={product.reviews} size={13} />

        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-2">
            <PriceTag product={product} size="md" />
            {product.discount > 0 && (
              <span className="mb-0.5 shrink-0 rounded-md bg-coral-50 px-1.5 py-0.5 text-xs font-extrabold text-coral-600">-{product.discount}%</span>
            )}
          </div>
          <p className="mt-1 h-4 text-xs font-bold">
            {low && <span className="text-coral-600">¡Últimas {product.stock} unidades!</span>}
            {out && <span className="text-ink-500">Sin stock</span>}
          </p>

          <div className="mt-2">
            {qty > 0 ? (
              <QuantitySelector
                value={qty}
                min={0}
                max={maxQty(product)}
                size="md"
                className="w-full justify-between"
                label={`Cantidad en el carrito de ${product.name}`}
                onChange={(n) => setQty(product.id, n)}
              />
            ) : (
              <button
                type="button"
                disabled={out}
                onClick={() => add(product)}
                className="btn btn-primary w-full"
                aria-label={out ? `${product.name} agotado` : `Agregar ${product.name} al carrito`}
              >
                <ShoppingBag size={18} />
                {out ? 'Agotado' : 'Agregar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
