import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, IdCard, MapPin, Navigation, ShieldCheck, Store } from 'lucide-react';
import { categories } from '@/data/categories';
import { brands, products } from '@/data/products';
import { store } from '@/data/stores';
import { brandSlug } from '@/lib/catalog';
import { MAPS_URL, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants';
import HeroBanner from '@/components/HeroBanner';
import CategoryCard from '@/components/CategoryCard';
import ProductGrid from '@/components/ProductGrid';
import BestSellers from '@/components/home/BestSellers';
import FlashDeals from '@/components/home/FlashDeals';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | ${SITE_TAGLINE}` },
  alternates: { canonical: '/' },
};

const benefits = [
  { icon: Store, title: 'Solo retiro en tienda', text: 'Sin despacho, sin costo' },
  { icon: Clock, title: 'Listo en 1 hora', text: 'Compra online y retira' },
  { icon: IdCard, title: 'Retiro con cédula', text: 'Venta solo a mayores de 18' },
  { icon: ShieldCheck, title: 'Paga como quieras', text: 'Tarjeta, transferencia o en tienda' },
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
  const newest = products.filter((p) => p.isNew).slice(0, 5);
  const topBrands = brands.slice(0, 14);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/productos?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
      },
      {
        '@type': 'LiquorStore',
        name: SITE_NAME,
        url: SITE_URL,
        telephone: store.phone,
        address: { '@type': 'PostalAddress', streetAddress: 'Avenida Prat 813', addressLocality: 'Quirihue', addressRegion: 'Ñuble', addressCountry: 'CL' },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">Botillería Oasis en Quirihue: ofertas en licores, bebidas y papas fritas</h1>

      {/* Ofertas al comienzo */}
      <div className="container-page pt-4 md:pt-6">
        <HeroBanner />
      </div>

      <FlashDeals />

      {/* Beneficios */}
      <section aria-label="Cómo comprar en Botillería Oasis" className="container-page mt-10">
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

      {/* Productos por categoría */}
      <section aria-labelledby="categorias" className="container-page mt-12 md:mt-16">
        <SectionHeader id="categorias" title="Productos" href="/productos" label="Ver todo el catálogo" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <BestSellers />

      {/* Dónde encontrarnos */}
      <section aria-labelledby="donde" className="container-page mt-12 md:mt-16">
        <div className="grid overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto md:min-h-[420px]">
            <Image src="/local.jpg" alt="Fachada de Botillería Oasis en Avenida Prat 813, Quirihue" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700"><MapPin size={15} /> Nuestro local</span>
            <h2 id="donde" className="mt-3 text-[28px] font-extrabold leading-tight md:text-4xl">Dónde encontrarnos</h2>
            <p className="mt-3 text-lg font-bold text-ink-900">{store.address}</p>
            <p className="mt-1 flex items-start gap-2 text-ink-600"><Clock size={17} className="mt-1 shrink-0 text-ink-400" /> {store.hoursLabel}</p>
            <p className="mt-4 text-ink-600">Compra online y retira en el local, listo en 1 hora. No tenemos despacho a domicilio. Lleva tu cédula: vendemos alcohol solo a mayores de 18 años.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg"><Navigation size={19} /> Cómo llegar</a>
              <Link href="/donde-encontrarnos" className="btn btn-outline btn-lg">Ver más</Link>
            </div>
          </div>
        </div>
      </section>

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
