import type { Product } from '@/types';
import ProductCard from './ProductCard';

const grids = {
  wide: 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5',
  catalog: 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4',
};

export default function ProductGrid({ products, variant = 'wide' }: { products: Product[]; variant?: keyof typeof grids }) {
  return (
    <div className={grids[variant]}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
