import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Crown, CreditCard, Store, Truck } from 'lucide-react';
import { categories } from '@/data/categories';
import { brands, getProduct, products } from '@/data/products';
import { brandSlug } from '@/lib/catalog';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants';
import HeroBanner from '@/components/HeroBanner';
import CategoryCard from '@/components/CategoryCard';
import ProductGrid from '@/components/ProductGrid';
import ProductImage from '@/components/ProductImage';
import BestSellers from '@/components/home/BestSellers';
import FlashDeals from '@/components/home/FlashDeals';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | ${SITE_TAGLINE}` },
  alternates: { canonical: '/' },
};

const benefits = [
  { icon: Truck, title: 'Despacho a todo Chile', text: 'Gratis desde $30.000' },
  { icon: Store, title: 'Retiro en 2 horas', text: 'Gratis en 5 tiendas' },
  { icon: CreditCard, title: 'Paga como quieras', text: 'Tarjetas, transferencia o Webpay' },
  { icon: Crown, title: 'Club MIXMARKET', text: '1 punto por cada $100' },
];

function SectionHeader({ id, title, href, label }: { id: string; title: string; href?: string; label?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 id={id} className="text-2xl font-extrabold md:text-[32px]">{title}</h2>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-700 hover:underline">
          {label ?? 'Ver todos'} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const mascota = getProduct('alimento-perro-adulto-15kg')!;
  const retiro = getProduct('papel-higienico-doble-hoja-24')!;
  const newest = products.filter((p) => p.isNew).slice(0, 5);
  const topBrands = brands.slice(0, 14);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/productos?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">MIXMARKET: todo lo que buscas, en un solo lugar</h1>

      <div className="container-page pt-4 md:pt-6">
        <HeroBanner />
      </div>

      {/* Beneficios */}
      <section aria-label="Beneficios de comprar en MIXMARKET" className="container-page mt-5">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3.5 shadow-card sm:p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><b.icon size={22} /></span>
              <span className="leading-tight">
                <span className="block text-sm font-extrabold sm:text-[15px]">{b.title}</span>
                <span className="block text-[13px] text-ink-500">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Categorías */}
      <section aria-labelledby="categorias" className="container-page mt-12 md:mt-16">
        <SectionHeader id="categorias" title="Compra por categoría" href="/productos" label="Ver catálogo" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <BestSellers />

      {/* Banners promocionales */}
      <section aria-label="Promociones" className="container-page mt-12 md:mt-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/tiendas" className="group relative isolate flex min-h-[190px] flex-col justify-center overflow-hidden rounded-3xl bg-brand-600 p-6 text-white">
            <span aria-hidden className="absolute -bottom-16 -right-10 -z-10 h-52 w-52 rounded-full bg-brand-400/60" />
            <h3 className="max-w-[60%] font-display text-2xl font-extrabold leading-tight">Retira gratis en tu tienda más cercana</h3>
            <p className="mt-1.5 max-w-[60%] text-sm text-brand-100">Listo en 2 horas, sin filas.</p>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl bg-sun-400 px-4 py-2 text-sm font-bold text-ink-900">Ver tiendas <ArrowRight size={15} /></span>
            <div className="pointer-events-none absolute -bottom-4 right-0 h-[72%] w-[40%] transition-transform duration-500 group-hover:-translate-y-1">
              <ProductImage product={retiro} bare className="h-full w-full drop-shadow-[0_8px_10px_rgba(20,18,43,.25)]" />
            </div>
          </Link>

          <Link href="/club" className="group relative isolate flex min-h-[190px] flex-col justify-center overflow-hidden rounded-3xl bg-sun-400 p-6 text-ink-900">
            <span aria-hidden className="absolute -right-8 -top-10 -z-10 h-48 w-48 rounded-full bg-sun-300" />
            <Crown size={30} className="text-ink-900" />
            <h3 className="mt-2 max-w-[75%] font-display text-2xl font-extrabold leading-tight">Suma puntos con el Club MIXMARKET</h3>
            <p className="mt-1.5 max-w-[75%] text-sm text-ink-700">1 punto por cada $100 de compra.</p>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl bg-ink-900 px-4 py-2 text-sm font-bold text-white">Conocer el Club <ArrowRight size={15} /></span>
          </Link>

          <Link href="/productos/mascotas" className="group relative isolate flex min-h-[190px] flex-col justify-center overflow-hidden rounded-3xl bg-[#e8f0d6] p-6 text-ink-900">
            <span aria-hidden className="absolute -bottom-16 -right-10 -z-10 h-52 w-52 rounded-full bg-[#7a9b2a]/30" />
            <h3 className="max-w-[58%] font-display text-2xl font-extrabold leading-tight">Todo para tu mascota con hasta 35% OFF</h3>
            <p className="mt-1.5 max-w-[58%] text-sm text-ink-700">Alimento, arena y accesorios.</p>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl bg-ink-900 px-4 py-2 text-sm font-bold text-white">Ver mascotas <ArrowRight size={15} /></span>
            <div className="pointer-events-none absolute -bottom-3 right-0 h-[78%] w-[42%] transition-transform duration-500 group-hover:-translate-y-1">
              <ProductImage product={mascota} bare className="h-full w-full drop-shadow-[0_8px_10px_rgba(20,18,43,.25)]" />
            </div>
          </Link>
        </div>
      </section>

      <FlashDeals />

      {/* Novedades */}
      <section aria-labelledby="novedades" className="container-page mt-12 md:mt-16">
        <SectionHeader id="novedades" title="Recién llegados" href="/nuevos" label="Ver novedades" />
        <div className="mt-5"><ProductGrid products={newest} /></div>
      </section>

      {/* Marcas */}
      <section aria-labelledby="marcas" className="container-page mt-12 md:mt-16">
        <SectionHeader id="marcas" title="Marcas que te encantan" href="/marcas" label="Ver todas las marcas" />
        <ul className="scrollbar-none -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {topBrands.map((b) => (
            <li key={b} className="shrink-0">
              <Link href={`/productos?marca=${brandSlug(b)}`} className="flex h-14 items-center gap-3 rounded-2xl border border-ink-100 bg-white px-4 shadow-card transition hover:border-brand-300 hover:shadow-lift">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 font-display text-base font-extrabold text-brand-700">{b.charAt(0)}</span>
                <span className="font-bold">{b}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
