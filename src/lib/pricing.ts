import type { Product } from '@/types';

export interface PricedLine {
  product: Product;
  qty: number;
}

export interface Totals {
  count: number;
  /** Suma a precio normal */
  subtotal: number;
  /** Ahorro por ofertas */
  discounts: number;
  /** Suma a precio de oferta */
  itemsTotal: number;
  /** Todo se retira en tienda: no hay costo de despacho */
  total: number;
  /** El carrito incluye al menos un producto con alcohol */
  hasAlcohol: boolean;
}

export function calcTotals(lines: PricedLine[]): Totals {
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.product.originalPrice * l.qty, 0);
  const itemsTotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  return {
    count,
    subtotal,
    discounts: subtotal - itemsTotal,
    itemsTotal,
    total: itemsTotal,
    hasAlcohol: lines.some((l) => l.product.isAlcohol),
  };
}
