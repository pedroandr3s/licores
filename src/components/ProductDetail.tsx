'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck, CheckCircle2, Clock, IdCard, MapPin, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';
import type { Product } from '@/types';
import { categoryMap } from '@/data/categories';
import { store } from '@/data/stores';
import { MIN_AGE } from '@/lib/constants';
import { maxQty } from '@/data/products';
import { brandSlug } from '@/lib/catalog';
import { getReviews, ratingBreakdown } from '@/lib/reviews';
import { cn } from '@/lib/format';
import { availabilityLabel, availabilityStyle, storeAvailability } from '@/lib/availability';
import { useCartActions } from '@/hooks/useCartActions';
import Breadcrumbs from './Breadcrumbs';
import ProductGallery from './ProductGallery';
import Rating, { Stars } from './Rating';
import PriceTag from './PriceTag';
import QuantitySelector from './QuantitySelector';
import FavoriteButton from './FavoriteButton';
import ProductGrid from './ProductGrid';
import { formatCLP } from '@/lib/format';

const TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'opiniones', label: 'Opiniones' },
  { id: 'envios', label: 'Retiro y cambios' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const router = useRouter();
  const { add, qtyInCart } = useCartActions();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabId>('descripcion');
  const category = categoryMap[product.category];
  const out = product.stock <= 0;
  const low = !out && product.stock <= 10;
  const max = maxQty(product);
  const availability = storeAvailability(product);
  const inCart = qtyInCart(product.id);
  const reviews = getReviews(product);
  const breakdown = ratingBreakdown(product);

  const addToCart = () => add(product, qty);
  const buyNow = () => {
    if (add(product, qty, { silent: true }) || inCart > 0) router.push('/checkout');
  };

  return (
    <div className="container-page pb-24 pt-5 md:pb-10 md:pt-7">
      <Breadcrumbs
        items={[
          { label: category.name, href: `/productos/${category.slug}` },
          { label: product.subcategory, href: `/productos/${category.slug}?sub=${encodeURIComponent(product.subcategory)}` },
          { label: product.name },
        ]}
      />

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
        <ProductGallery product={product} />

        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Link href={`/productos?marca=${brandSlug(product.brand)}`} className="font-bold text-brand-700 hover:underline">{product.brand}</Link>
            <span className="text-ink-400">SKU {product.sku}</span>
            {product.isNew && <span className="badge bg-sun-400 text-ink-900">Nuevo</span>}
          </div>
          <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] md:text-[36px]">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="#opiniones" onClick={() => setTab('opiniones')} className="hover:opacity-80"><Rating rating={product.rating} reviews={product.reviews} size={16} /></a>
            <span className="text-sm text-ink-500">{product.sold.toLocaleString('es-CL')} vendidos</span>
          </div>

          <div className="mt-5 rounded-2xl bg-ink-50 p-4 sm:p-5">
            <PriceTag product={product} size="lg" showSavings />
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-ink-700">{product.description.split('. ')[0].replace(/\.$/, '')}.</p>

          <p className={cn('mt-4 flex items-center gap-2 text-[15px] font-bold', out ? 'text-ink-500' : low ? 'text-coral-600' : 'text-mint-700')}>
            <span className={cn('h-2.5 w-2.5 rounded-full', out ? 'bg-ink-300' : low ? 'bg-coral-500' : 'bg-mint-500')} />
            {out ? 'Agotado' : low ? `¡Últimas ${product.stock} unidades!` : `En stock · ${product.stock} unidades disponibles`}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} min={1} max={Math.max(1, max)} size="lg" onChange={setQty} />
            <button type="button" onClick={addToCart} disabled={out} className="btn btn-primary btn-lg min-w-[220px] flex-1">
              <ShoppingBag size={20} /> {out ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={buyNow} disabled={out} className="btn btn-sun btn-lg"><Zap size={19} className="fill-current" /> Comprar ahora</button>
            <FavoriteButton productId={product.id} variant="button" className="w-full" />
          </div>
          {inCart > 0 && (
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-brand-700">
              <CheckCircle2 size={16} /> Tienes {inCart} en tu carrito · <Link href="/carrito" className="underline">Ver carrito</Link>
            </p>
          )}

          <section className="mt-8" aria-labelledby="como-recibirlo">
            <h2 id="como-recibirlo" className="text-xl font-extrabold">Retiro en tienda</h2>
            <div className="mt-3 rounded-2xl border border-brand-600 bg-white p-4 ring-2 ring-brand-600/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white"><MapPin size={22} /></span>
                  <div>
                    <p className="font-extrabold text-ink-900">{store.name}</p>
                    <p className="text-sm text-ink-600">{store.address}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600"><Clock size={14} className="text-ink-400" /> Listo en 1 hora · Gratis</p>
                  </div>
                </div>
                <span className={cn('badge shrink-0', availabilityStyle[availability])}>{availabilityLabel[availability]}</span>
              </div>
              <p className="mt-3 rounded-xl bg-ink-50 px-3.5 py-2.5 text-sm text-ink-700">Solo retiro en tienda: no tenemos despacho a domicilio.</p>
            </div>
            {product.isAlcohol && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-sun-100 px-3.5 py-2.5 text-sm font-semibold text-[#6b4700]">
                <IdCard size={18} className="mt-0.5 shrink-0" /> Venta solo a mayores de {MIN_AGE} años. Debes presentar tu cédula de identidad al retirar.
              </p>
            )}
          </section>

          <ul className="mt-6 grid gap-3 text-sm text-ink-600 sm:grid-cols-3">
            <li className="flex items-center gap-2"><ShieldCheck size={18} className="shrink-0 text-brand-600" /> Compra protegida</li>
            <li className="flex items-center gap-2"><Clock size={18} className="shrink-0 text-brand-600" /> Listo en 1 hora</li>
            <li className="flex items-center gap-2"><IdCard size={18} className="shrink-0 text-brand-600" /> Retiro con cédula</li>
          </ul>
        </div>
      </div>

      {/* Pestañas de información */}
      <section className="mt-12" aria-label="Información del producto">
        <div className="scrollbar-none flex gap-1 overflow-x-auto border-b border-ink-200" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={t.id === 'opiniones' ? 'opiniones' : undefined}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn('relative shrink-0 px-4 py-3 text-[15px] font-bold transition-colors', tab === t.id ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800')}
            >
              {t.label}
              {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-brand-600" />}
            </button>
          ))}
        </div>

        <div className="card mt-5 p-5 sm:p-7" role="tabpanel">
          {tab === 'descripcion' && (
            <div className="max-w-3xl">
              <h2 className="text-xl font-extrabold">Sobre este producto</h2>
              <p className="mt-3 leading-relaxed text-ink-700">{product.description}</p>
            </div>
          )}
          {tab === 'caracteristicas' && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-extrabold">Características</h2>
                <ul className="mt-3 space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-ink-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-mint-600" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Ficha técnica</h2>
                <dl className="mt-3 divide-y divide-ink-100 text-[15px]">
                  {[
                    ['Marca', product.brand],
                    ['Categoría', `${category.name} › ${product.subcategory}`],
                    ['SKU', product.sku],
                    ['Contenido', product.volume],
                    ...(product.abv !== undefined ? [['Graduación', String(product.abv).replace('.', ',') + '° (% vol.)']] : []),
                    ['Retiro en tienda', store.shortName],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] gap-3 py-2.5"><dt className="text-ink-500">{k}</dt><dd className="font-semibold">{v}</dd></div>
                  ))}
                </dl>
              </div>
            </div>
          )}
          {tab === 'opiniones' && (
            <div className="grid gap-8 md:grid-cols-[260px_1fr]">
              <div>
                <p className="font-display text-6xl font-extrabold leading-none">{product.rating.toFixed(1)}</p>
                <div className="mt-2"><Stars rating={product.rating} size={20} /></div>
                <p className="mt-1.5 text-sm text-ink-500">{product.reviews.toLocaleString('es-CL')} opiniones</p>
                <ul className="mt-4 space-y-1.5">
                  {breakdown.map((b) => (
                    <li key={b.stars} className="flex items-center gap-2 text-sm">
                      <span className="w-7 font-semibold text-ink-600">{b.stars} ★</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100"><span className="block h-full rounded-full bg-sun-500" style={{ width: `${b.pct}%` }} /></span>
                      <span className="w-9 text-right text-ink-500">{b.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="divide-y divide-ink-100">
                {reviews.map((r, i) => (
                  <li key={i} className="py-4 first:pt-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Stars rating={r.rating} size={15} />
                      <span className="font-bold">{r.title}</span>
                    </div>
                    <p className="mt-1.5 text-ink-700">{r.body}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-ink-500">
                      {r.author} · {r.date}
                      {r.verified && <span className="inline-flex items-center gap-1 font-semibold text-mint-700"><BadgeCheck size={14} /> Compra verificada</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'envios' && (
            <div className="grid max-w-4xl gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-extrabold">Retiro en tienda</h2>
                <ul className="mt-3 space-y-2 text-ink-700">
                  <li>Solo retiro en {store.name}; no hay despacho a domicilio.</li>
                  <li>Tu pedido queda listo en 1 hora, sin costo.</li>
                  <li>Para retirar alcohol debes ser mayor de {MIN_AGE} años y presentar tu cédula.</li>
                </ul>
                <Link href="/ayuda/politicas-de-retiro" className="mt-3 inline-block font-bold text-brand-700 hover:underline">Ver políticas de retiro</Link>
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Cambios y devoluciones</h2>
                <ul className="mt-3 space-y-2 text-ink-700">
                  <li>Revisa tu pedido al retirarlo: los reclamos se atienden en el local.</li>
                  <li>Cambios solo por botellas dañadas o fallas de fábrica.</li>
                  <li>Productos abiertos y refrigerados no tienen cambio.</li>
                </ul>
                <Link href="/ayuda/cambios-y-devoluciones" className="mt-3 inline-block font-bold text-brand-700 hover:underline">Ver cambios y devoluciones</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-2xl font-extrabold md:text-[30px]">También te puede interesar</h2>
          <div className="mt-5"><ProductGrid products={related} /></div>
        </section>
      )}

      {/* Barra fija móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 p-3 pb-safe shadow-[0_-8px_24px_rgba(20,18,43,.08)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="leading-tight">
            <p className="font-display text-xl font-extrabold">{formatCLP(product.price)}</p>
            {product.discount > 0 && <p className="text-xs text-ink-400 line-through">{formatCLP(product.originalPrice)}</p>}
          </div>
          <button type="button" onClick={addToCart} disabled={out} className="btn btn-primary h-12 flex-1">
            <ShoppingBag size={19} /> {out ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
