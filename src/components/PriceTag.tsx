import type { Product } from '@/types';
import { formatCLP } from '@/lib/format';

interface Props {
  product: Pick<Product, 'price' | 'originalPrice' | 'discount'>;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}

const cur = { sm: 'text-lg', md: 'text-[22px]', lg: 'text-4xl md:text-[40px]' };
const old = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg' };

export default function PriceTag({ product, size = 'md', showSavings }: Props) {
  const hasDiscount = product.discount > 0 && product.originalPrice > product.price;
  return (
    <div className="flex flex-wrap items-end gap-x-2.5 gap-y-0.5">
      <span className={`font-display font-extrabold leading-none tracking-tight text-ink-900 ${cur[size]}`}>{formatCLP(product.price)}</span>
      {hasDiscount && (
        <>
          <span className={`pb-0.5 font-medium text-ink-400 line-through ${old[size]}`}>
            <span className="sr-only">Precio normal </span>
            {formatCLP(product.originalPrice)}
          </span>
          {size === 'lg' && (
            <span className="mb-1 rounded-md bg-coral-500 px-2 py-0.5 text-sm font-extrabold text-white">-{product.discount}%</span>
          )}
        </>
      )}
      {showSavings && hasDiscount && (
        <p className="basis-full pt-1 text-sm font-semibold text-mint-700">Ahorras {formatCLP(product.originalPrice - product.price)}</p>
      )}
    </div>
  );
}
