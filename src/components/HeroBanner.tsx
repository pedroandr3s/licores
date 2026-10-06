'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProduct } from '@/data/products';
import ProductImage from './ProductImage';

interface ArtItem {
  id: string;
  style: React.CSSProperties;
}

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  bg: string;
  tone: 'light' | 'dark';
  blob: string;
  art?: ArtItem[];
  custom?: ReactNode;
  sticker?: { text: string; sub?: string };
}

const slides: Slide[] = [
  {
    id: 'ofertas',
    title: 'Ofertas de la semana en licores',
    subtitle: 'Cervezas, vinos y destilados con hasta 27% de descuento',
    cta: { label: 'Ver ofertas', href: '/ofertas' },
    bg: 'bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500',
    tone: 'light',
    blob: 'bg-sun-400',
    sticker: { text: '-27%', sub: 'hasta' },
    art: [
      { id: 'cerveza-golden-ale-pack-12', style: { left: '-2%', bottom: '2%', height: '50%', transform: 'rotate(-8deg)' } },
      { id: 'whisky-blended-12-750', style: { left: '22%', bottom: '4%', height: '82%', transform: 'rotate(-3deg)' } },
      { id: 'vino-carmenere-gran-reserva-750', style: { right: '-3%', bottom: '6%', height: '62%', transform: 'rotate(7deg)' } },
    ],
  },
  {
    id: 'pisco',
    title: 'Pisco, ron y gin para tus tragos',
    subtitle: 'Destilados desde $7.490 con mixers para combinar',
    cta: { label: 'Ver destilados', href: '/productos/destilados' },
    bg: 'bg-gradient-to-br from-ink-900 via-[#3a2a0c] to-[#a8741a]',
    tone: 'light',
    blob: 'bg-sun-500',
    art: [
      { id: 'ginger-ale-15l', style: { left: '-2%', bottom: '2%', height: '52%', transform: 'rotate(-7deg)' } },
      { id: 'pisco-reserva-40-750', style: { left: '22%', bottom: '4%', height: '82%', transform: 'rotate(-2deg)' } },
      { id: 'gin-botanico-700', style: { right: '-3%', bottom: '6%', height: '64%', transform: 'rotate(8deg)' } },
    ],
  },
  {
    id: 'snacks',
    title: 'Papas fritas y picoteo para la junta',
    subtitle: 'Papas, maní y mix cóctel listos para compartir',
    cta: { label: 'Ver snacks', href: '/productos/snacks' },
    bg: 'bg-gradient-to-br from-coral-600 via-coral-500 to-[#ff8a3d]',
    tone: 'light',
    blob: 'bg-sun-300',
    art: [
      { id: 'papas-onduladas-bbq-180', style: { left: '-2%', bottom: '2%', height: '52%', transform: 'rotate(-8deg)' } },
      { id: 'papas-fritas-clasicas-250', style: { left: '22%', bottom: '3%', height: '84%', transform: 'rotate(-2deg)' } },
      { id: 'mix-coctel-500', style: { right: '-3%', bottom: '6%', height: '64%', transform: 'rotate(7deg)' } },
    ],
  },
  {
    id: 'retiro',
    title: 'Compra online y retira en Quirihue',
    subtitle: 'Avenida Prat 813 · Listo en 1 hora · Solo retiro en tienda',
    cta: { label: 'Dónde encontrarnos', href: '/donde-encontrarnos' },
    bg: 'bg-gradient-to-br from-[#14532d] via-[#1f7a3f] to-[#4ba35a]',
    tone: 'light',
    blob: 'bg-sun-400',
    art: [
      { id: 'hielo-cubos-2kg', style: { left: '-2%', bottom: '2%', height: '52%', transform: 'rotate(-8deg)' } },
      { id: 'cerveza-lager-andina-pack-6', style: { left: '22%', bottom: '3%', height: '84%', transform: 'rotate(-2deg)' } },
      { id: 'vino-sauvignon-blanc-750', style: { right: '-3%', bottom: '6%', height: '64%', transform: 'rotate(7deg)' } },
    ],
  },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="overflow-hidden rounded-3xl shadow-card"
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(.22,.8,.3,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => {
            const dark = s.tone === 'dark';
            return (
              <div
                key={s.id}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${slides.length}`}
                aria-hidden={i !== index}
                className={`relative h-[390px] w-full shrink-0 overflow-hidden sm:h-[410px] lg:h-[450px] ${s.bg} ${dark ? 'text-ink-900' : 'text-white'}`}
              >
                <span aria-hidden className={`absolute -right-[8%] top-1/2 h-[120%] w-[48%] -translate-y-1/2 rounded-full opacity-90 sm:w-[42%] lg:w-[36%] ${s.blob}`} style={{ aspectRatio: '1' }} />
                <span aria-hidden className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

                <div className="relative z-10 flex h-full max-w-[62%] flex-col justify-center pl-6 sm:max-w-[55%] md:pl-12 lg:max-w-[50%] lg:pl-16">
                  <h2 className="text-balance font-display text-[27px] font-extrabold uppercase leading-[1.1] tracking-tight sm:text-4xl lg:text-[54px]">{s.title}</h2>
                  <p className={`mt-3 max-w-md text-[15px] font-medium sm:text-lg ${dark ? 'text-ink-800' : 'text-white/90'}`}>{s.subtitle}</p>
                  <div className="mt-6">
                    <Link href={s.cta.href} tabIndex={i === index ? 0 : -1} className={`btn btn-lg ${dark ? 'btn-dark' : 'btn-sun'}`}>
                      {s.cta.label}
                    </Link>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[42%] sm:w-[46%] lg:w-[44%]">
                  {s.art?.map((a) => {
                    const p = getProduct(a.id);
                    if (!p) return null;
                    return (
                      <div key={a.id} className="absolute aspect-square" style={{ ...a.style, maxWidth: parseFloat(String(a.style.height)) >= 70 ? '96%' : '60%' }}>
                        <ProductImage product={p} bare className="h-full w-full drop-shadow-[0_14px_16px_rgba(20,18,43,.28)]" />
                      </div>
                    );
                  })}
                  {s.custom}
                  {s.sticker && (
                    <span className="absolute right-[8%] top-[10%] grid h-[74px] w-[74px] rotate-12 place-items-center rounded-full bg-coral-500 text-center leading-none text-white shadow-lg ring-4 ring-white/80 sm:h-[92px] sm:w-[92px]">
                      <span>
                        <span className="block text-[10px] font-bold sm:text-xs">{s.sticker.sub}</span>
                        <span className="font-display text-xl font-extrabold sm:text-3xl">{s.sticker.text}</span>
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button type="button" onClick={() => go(index - 1)} aria-label="Diapositiva anterior" className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white md:grid">
        <ChevronLeft size={22} />
      </button>
      <button type="button" onClick={() => go(index + 1)} aria-label="Diapositiva siguiente" className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white md:grid">
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-4 left-6 flex items-center gap-2 md:left-12 lg:left-16" role="tablist" aria-label="Elegir diapositiva">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'} ${slides[index].tone === 'dark' ? (i === index ? '!bg-ink-900' : '!bg-ink-900/30') : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
