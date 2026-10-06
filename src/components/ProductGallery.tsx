'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/format';
import ProductImage from './ProductImage';

const VIEW_LABELS = ['Vista frontal', 'Detalle', 'Ambiente', 'Presentación'];

export default function ProductGallery({ product }: { product: Product }) {
  const total = product.images?.length ?? 4;
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const go = (i: number) => setView((i + total) % total);

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      <div className="relative flex-1">
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <div
            className="h-full w-full transition-transform duration-150 ease-out"
            style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          >
            <ProductImage product={product} view={view} className="h-full w-full" alt={`${product.name} — ${VIEW_LABELS[view % 4]}`} />
          </div>
          <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink-600 shadow-sm md:inline-flex">
            <ZoomIn size={14} /> Pasa el mouse para ampliar
          </span>
          {product.discount >= 10 && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-lg bg-coral-500 px-2.5 py-1 text-sm font-extrabold text-white shadow-sm">-{product.discount}%</span>
          )}
        </div>
        <button type="button" onClick={() => go(view - 1)} aria-label="Imagen anterior" className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md hover:bg-white md:hidden">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={() => go(view + 1)} aria-label="Imagen siguiente" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md hover:bg-white md:hidden">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex gap-2.5 md:flex-col" role="tablist" aria-label="Miniaturas del producto">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={view === i}
            aria-label={VIEW_LABELS[i % 4]}
            onClick={() => setView(i)}
            className={cn(
              'h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition md:h-[84px] md:w-[84px]',
              view === i ? 'border-brand-600 shadow-sm' : 'border-ink-100 opacity-80 hover:border-brand-300 hover:opacity-100',
            )}
          >
            <ProductImage product={product} view={i} className="h-full w-full" alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
