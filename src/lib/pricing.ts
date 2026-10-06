import type { DeliveryMode, Product } from '@/types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from './constants';

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
  /** Suma a precio de oferta (antes de despacho) */
  itemsTotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  shippingIsFree: boolean;
}

export function calcTotals(lines: PricedLine[], mode: DeliveryMode): Totals {
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.product.originalPrice * l.qty, 0);
  const itemsTotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const discounts = subtotal - itemsTotal;
  const allFree = lines.length > 0 && lines.every((l) => l.product.freeShipping);
  const freeByAmount = itemsTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingIsFree = mode === 'pickup' || lines.length === 0 || allFree || freeByAmount;
  const shipping = shippingIsFree ? 0 : SHIPPING_COST;
  return {
    count,
    subtotal,
    discounts,
    itemsTotal,
    shipping,
    total: itemsTotal + shipping,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - itemsTotal),
    shippingIsFree,
  };
}
