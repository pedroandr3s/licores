'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Flame, Zap } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useSimulatedLoading } from '@/hooks/useMounted';
import { cn } from '@/lib/format';
import Countdown from './Countdown';
import Breadcrumbs from './Breadcrumbs';
import ProductCard from './ProductCard';
import ProductGrid from './ProductGrid';
import { ProductGridSkeleton } from './Skeletons';

const DISCOUNTS = [0, 20, 30, 50, 70];

function soldPct(sold: number) {
  return 45 + (sold % 50);
}

export default function OffersView() {
  const [disc, setDisc] = useState(0);
  const [cat, setCat] = useState('');
  const [visible, setVisible] = useState(15);
  const loading = useSimulatedLoading(`${disc}|${cat}`, 380);

  const flash = useMemo(
    () => products.filter((p) => p.stock > 0).sort((a, b) => b.discount - a.discount || b.sold - a.sold).slice(0, 5),
    [],
  );

  const list = useMemo(
    () =>
      products
        .filter((p) => p.discount >= Math.max(disc, 20) && (!cat || p.category === cat))
        .sort((a, b) => b.discount - a.discount || b.sold - a.sold),
    [disc, cat],
  );

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Ofertas' }]} />

      <section className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-coral-600 via-coral-500 to-[#ff8a3d] p-6 text-white sm:p-10 lg:p-14" aria-labelledby="ofertas-titulo">
        <span aria-hidden className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-sun-400/90" />
        <span aria-hidden className="absolute -bottom-24 right-40 hidden h-64 w-64 rounded-full bg-white/10 lg:block" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold"><Flame size={16} /> Ofertas MIXMARKET</span>
          <h1 id="ofertas-titulo" className="mt-4 text-5xl font-extrabold leading-[1] sm:text-6xl lg:text-7xl">Hasta 70% OFF</h1>
          <p className="mt-3 max-w-lg text-lg text-white/90">Precios rebajados en perfumería, tecnología, hogar y más. Hasta agotar stock.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="text-lg font-bold">Oferta termina en <Countdown variant="inline" /></p>
          </div>
          <div className="mt-5"><Countdown variant="light" /></div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="flash-titulo">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sun-400 text-ink-900"><Zap size={22} className="fill-current" /></span>
          <h2 id="flash-titulo" className="text-2xl font-extrabold md:text-[30px]">Ofertas flash</h2>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {flash.map((p) => (
            <li key={p.id} className="flex flex-col gap-2">
              <ProductCard product={p} />
              <div className="rounded-xl bg-white px-3 py-2 shadow-card ring-1 ring-ink-100">
                <div className="flex items-center justify-between text-xs font-bold"><span className="text-coral-600">Vendido {soldPct(p.sold)}%</span><span className="text-ink-500">Quedan pocas</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-gradient-to-r from-coral-500 to-sun-400" style={{ width: `${soldPct(p.sold)}%` }} /></div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="destacados-titulo">
        <h2 id="destacados-titulo" className="text-2xl font-extrabold md:text-[30px]">Productos destacados con descuento</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por descuento">
          {DISCOUNTS.map((d) => (
            <button key={d} type="button" aria-pressed={disc === d} onClick={() => { setDisc(d); setVisible(15); }} className={cn('chip', disc === d && 'chip-active')}>
              {d === 0 ? 'Todas las ofertas' : `${d}% o más`}
            </button>
          ))}
        </div>
        <div className="scrollbar-none -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por categoría">
          <button type="button" aria-pressed={cat === ''} onClick={() => { setCat(''); setVisible(15); }} className={cn('chip shrink-0', cat === '' && 'chip-active')}>Todas las categorías</button>
          {categories.map((c) => (
            <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => { setCat(c.slug); setVisible(15); }} className={cn('chip shrink-0', cat === c.slug && 'chip-active')}>{c.name}</button>
          ))}
        </div>

        <div className="mt-5">
          {loading ? (
            <ProductGridSkeleton count={10} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5" />
          ) : list.length === 0 ? (
            <div className="card px-6 py-12 text-center">
              <p className="text-xl font-extrabold">No hay ofertas con ese filtro</p>
              <p className="mt-1 text-ink-500">Prueba con otra categoría o un descuento menor.</p>
              <button type="button" onClick={() => { setDisc(0); setCat(''); }} className="btn btn-primary mt-5">Ver todas las ofertas</button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm font-semibold text-ink-500">{list.length} {list.length === 1 ? 'oferta' : 'ofertas'}</p>
              <ProductGrid products={list.slice(0, visible)} />
              {visible < list.length && (
                <div className="mt-8 text-center"><button type="button" onClick={() => setVisible((v) => v + 10)} className="btn btn-outline btn-lg">Ver más ofertas</button></div>
              )}
            </>
          )}
        </div>
        <p className="mt-8 text-center text-sm text-ink-500">¿Buscas algo específico? <Link href="/productos" className="font-bold text-brand-700 underline">Explora el catálogo completo</Link>.</p>
      </section>
    </div>
  );
}
