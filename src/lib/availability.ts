import type { Availability, Product } from '@/types';
import { HOME_STORE_ID, stores } from '@/data/stores';

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Disponibilidad simulada (determinística) de un producto en una tienda. */
export function storeAvailability(p: Product, storeId: string): Availability {
  if (!p.availableForPickup || p.stock <= 0) return 'none';
  if (storeId === HOME_STORE_ID) return p.stock <= 10 ? 'low' : 'available';
  const h = hash(`${p.id}:${storeId}`) % 10;
  if (h === 0) return 'none';
  if (h <= 2 || p.stock <= 10) return 'low';
  return 'available';
}

/** Disponibilidad combinada de un carrito en una tienda (la peor de todas). */
export function cartStoreAvailability(products: Product[], storeId: string): Availability {
  let worst: Availability = 'available';
  for (const p of products) {
    const a = storeAvailability(p, storeId);
    if (a === 'none') return 'none';
    if (a === 'low') worst = 'low';
  }
  return worst;
}

export function deliveryAvailability(p: Product): Availability {
  if (!p.availableForDelivery || p.stock <= 0) return 'none';
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

export const allStoreIds = stores.map((s) => s.id);
