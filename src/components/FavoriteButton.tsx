'use client';

import { Heart } from 'lucide-react';
import { useFavorite } from '@/hooks/useCartActions';
import { cn } from '@/lib/format';

interface Props {
  productId: string;
  productName?: string;
  variant?: 'floating' | 'button';
  className?: string;
}

export default function FavoriteButton({ productId, productName, variant = 'floating', className }: Props) {
  const { isFav, toggle } = useFavorite(productId);
  const label = isFav ? 'Quitar de favoritos' : 'Agregar a favoritos';

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFav}
        className={cn(
          'btn btn-outline h-[52px] gap-2 rounded-2xl px-5',
          isFav && 'border-coral-300 bg-coral-50 text-coral-600 hover:border-coral-400 hover:text-coral-700',
          className,
        )}
      >
        <Heart size={20} className={isFav ? 'fill-current' : ''} />
        {isFav ? 'En favoritos' : 'Agregar a favoritos'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFav}
      aria-label={productName ? `${label}: ${productName}` : label}
      title={label}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm ring-1 ring-ink-100 transition hover:scale-105 hover:ring-coral-300',
        isFav ? 'text-coral-500' : 'text-ink-500 hover:text-coral-500',
        className,
      )}
    >
      <Heart size={18} className={isFav ? 'fill-current' : ''} />
    </button>
  );
}
