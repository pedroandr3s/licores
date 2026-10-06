import type { Metadata } from 'next';
import Link from 'next/link';
import { brands, products } from '@/data/products';
import { brandSlug } from '@/lib/catalog';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Marcas',
  description: 'Todas las marcas disponibles en Botillería Oasis: cervezas, vinos, destilados y snacks.',
  alternates: { canonical: '/marcas' },
};

const PALETTE = ['bg-brand-50 text-brand-700', 'bg-coral-50 text-coral-600', 'bg-sun-100 text-[#8a5a00]', 'bg-mint-50 text-mint-700', 'bg-[#e0f0ff] text-[#1c64b8]'];

export default function MarcasPage() {
  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Marcas' }]} />
      <h1 className="mt-4 text-[28px] font-extrabold md:text-4xl">Marcas</h1>
      <p className="mt-1 text-ink-500">{brands.length} marcas disponibles. Elige una para ver todos sus productos.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {brands.map((b, i) => {
          const count = products.filter((p) => p.brand === b).length;
          return (
            <li key={b}>
              <Link href={`/productos?marca=${brandSlug(b)}`} className="card flex h-full flex-col items-start gap-3 p-4 transition-shadow hover:shadow-lift sm:p-5">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl font-display text-2xl font-extrabold ${PALETTE[i % PALETTE.length]}`}>{b.charAt(0)}</span>
                <span>
                  <span className="block text-lg font-extrabold leading-tight">{b}</span>
                  <span className="text-sm text-ink-500">{count} {count === 1 ? 'producto' : 'productos'}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
