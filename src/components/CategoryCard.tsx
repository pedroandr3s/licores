import Link from 'next/link';
import type { Category } from '@/types';
import { getProduct, products } from '@/data/products';
import ProductImage from './ProductImage';
import CategoryIcon from './CategoryIcon';

export default function CategoryCard({ category }: { category: Category }) {
  const hero = getProduct(category.heroProductId);
  const count = products.filter((p) => p.category === category.slug).length;
  return (
    <Link
      href={`/productos/${category.slug}`}
      className="group relative isolate flex h-[168px] flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-card transition-shadow hover:shadow-lift md:h-[190px]"
      style={{ background: category.colors[0] }}
    >
      <span
        aria-hidden
        className="absolute -bottom-14 -right-10 -z-10 h-44 w-44 rounded-full opacity-25 transition-transform duration-500 group-hover:scale-110"
        style={{ background: category.colors[1] }}
      />
      <div>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 shadow-sm" style={{ color: category.colors[1] }}>
          <CategoryIcon name={category.icon} size={19} />
        </span>
        <h3 className="mt-2.5 font-display text-[19px] font-extrabold leading-tight text-ink-900">{category.name}</h3>
        <p className="text-[13px] font-medium text-ink-600">{count} productos</p>
      </div>
      {hero && (
        <div className="pointer-events-none absolute -bottom-3 -right-2 h-[78%] w-[58%] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3">
          <ProductImage product={hero} bare className="h-full w-full drop-shadow-[0_8px_10px_rgba(20,18,43,.18)]" />
        </div>
      )}
    </Link>
  );
}
