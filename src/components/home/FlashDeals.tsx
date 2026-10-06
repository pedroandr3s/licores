'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { products } from '@/data/products';
import Countdown from '@/components/Countdown';
import ProductCard from '@/components/ProductCard';

export default function FlashDeals() {
  const ref = useRef<HTMLDivElement>(null);
  const list = products.filter((p) => p.stock > 0).sort((a, b) => b.discount - a.discount || b.sold - a.sold).slice(0, 10);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 480, behavior: 'smooth' });

  return (
    <section aria-labelledby="flash" className="mt-12 md:mt-16">
      <div className="container-page">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun-400 text-ink-900"><Zap size={26} className="fill-current" /></span>
              <div>
                <h2 id="flash" className="font-display text-2xl font-extrabold text-white md:text-[32px]">Ofertas flash</h2>
                <p className="text-ink-200">Hasta 70% de descuento. Se acaban cuando termina el reloj.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <span className="hidden text-sm font-semibold text-ink-200 sm:block">Termina en</span>
              <Countdown variant="light" />
            </div>
          </div>

          <div className="relative mt-6">
            <div ref={ref} className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 sm:gap-4">
              {list.map((p) => (
                <div key={p.id} className="w-[200px] shrink-0 snap-start sm:w-[230px]">
                  <ProductCard product={p} />
                </div>
              ))}
              <Link href="/ofertas" className="grid w-[200px] shrink-0 snap-start place-items-center rounded-2xl border-2 border-dashed border-white/30 p-6 text-center text-white transition hover:border-sun-400 hover:text-sun-300 sm:w-[230px]">
                <span>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10"><ArrowRight size={22} /></span>
                  <span className="mt-3 block font-display text-lg font-extrabold">Ver todas las ofertas</span>
                </span>
              </Link>
            </div>
            <button type="button" onClick={() => scroll(-1)} aria-label="Ofertas anteriores" className="absolute -left-3 top-1/3 hidden h-11 w-11 place-items-center rounded-full bg-white text-ink-900 shadow-pop hover:bg-sun-300 lg:grid">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Ofertas siguientes" className="absolute -right-3 top-1/3 hidden h-11 w-11 place-items-center rounded-full bg-white text-ink-900 shadow-pop hover:bg-sun-300 lg:grid">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
