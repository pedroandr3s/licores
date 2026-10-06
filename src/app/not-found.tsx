import Link from 'next/link';
import { categories } from '@/data/categories';

export default function NotFound() {
  return (
    <div className="container-page py-16 text-center md:py-24">
      <p className="font-display text-8xl font-extrabold text-brand-600 md:text-9xl">404</p>
      <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">No encontramos esta página</h1>
      <p className="mx-auto mt-2 max-w-md text-ink-500">Puede que el enlace haya cambiado o que el producto ya no esté disponible.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary btn-lg">Ir al inicio</Link>
        <Link href="/productos" className="btn btn-outline btn-lg">Ver productos</Link>
      </div>
      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <Link key={c.slug} href={`/productos/${c.slug}`} className="chip">{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
