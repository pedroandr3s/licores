import type { Availability, Product } from '@/types';

/** Disponibilidad de un producto en el único local (según stock). */
export function storeAvailability(p: Product): Availability {
  if (p.stock <= 0) return 'none';
  return p.stock <= 10 ? 'low' : 'available';
}

export const availabilityLabel: Record<Availability, string> = {
  available: 'Disponible',
  low: 'Últimas unidades',
  none: 'No disponible',
};

export const availabilityStyle: Record<Availability, string> = {
  available: 'bg-mint-50 text-mint-700',
  low: 'bg-sun-100 text-[#8a5a00]',
  none: 'bg-ink-100 text-ink-500',
};
