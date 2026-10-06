'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import { cn } from '@/lib/format';
import ProductGrid from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/Skeletons';

const TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'perfumeria', label: 'Perfumería' },
  { id: 'cuidado-personal', label: 'Cuidado personal' },
  { id: 'limpieza', label: 'Limpieza' },
  { id: 'tecnologia', label: 'Tecnología' },
  { id: 'hogar', label: 'Hogar' },
  { id: 'snacks', label: 'Snacks' },
];

export default function BestSellers() {
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 380);
    return () => window.clearTimeout(t);
  }, [tab]);

  const list = useMemo(
    () => products.filter((p) => tab === 'all' || p.category === tab).sort((a, b) => b.sold - a.sold).slice(0, 10),
    [tab],
  );
  const href = tab === 'all' ? '/productos?orden=bestsellers' : `/productos/${tab}?orden=bestsellers`;

  return (
    <section aria-labelledby="mas-vendidos" className="container-page mt-12 md:mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="mas-vendidos" className="text-2xl font-extrabold md:text-[32px]">Más vendidos</h2>
        <Link href={href} className="inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-700 hover:underline">
          Ver todos <ArrowRight size={16} />
        </Link>
      </div>
      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0" role="tablist" aria-label="Filtrar más vendidos por categoría">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn('chip shrink-0', tab === t.id && 'chip-active')}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-5" role="tabpanel">
        {loading ? <ProductGridSkeleton count={10} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5" /> : <ProductGrid products={list} />}
      </div>
    </section>
  );
}
