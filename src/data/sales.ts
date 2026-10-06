import type { OrderStatus, PaymentMethod } from '@/types';
import { products } from './products';

/** Venta simplificada para las estadísticas del panel de administración. */
export interface Sale {
  id: string;
  /** ISO local */
  date: string;
  items: { productId: string; qty: number; price: number }[];
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
  /** Cliente retiró con su pedido pagado online o pagó en tienda */
  source: 'web' | 'tienda';
}

/** Generador pseudoaleatorio determinístico (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T>(rand: () => number, items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Más ventas viernes y sábado, y a partir de la tarde.
const DOW_WEIGHT = [1.3, 0.7, 0.7, 0.85, 1.0, 1.9, 2.3]; // dom..sáb
const HOUR_WEIGHT: Record<number, number> = { 11: 1, 12: 2, 13: 2, 14: 1.5, 15: 1.5, 16: 2, 17: 3, 18: 4.5, 19: 5, 20: 4.5, 21: 3, 22: 1.5, 23: 1 };
const HOURS = Object.keys(HOUR_WEIGHT).map(Number);
const HOUR_W = HOURS.map((h) => HOUR_WEIGHT[h]);

const PAYMENTS: PaymentMethod[] = ['debit', 'credit', 'webpay', 'transfer', 'store'];
const PAYMENT_W = [30, 22, 18, 10, 20];

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

/** Genera `days` días de ventas simuladas que terminan en `anchor` (determinístico). */
export function generateSales(anchor: Date, days = 180): Sale[] {
  const rand = rng(20261005);
  const sellable = products.filter((p) => p.stock > 0);
  const weights = sellable.map((p) => Math.max(1, p.sold / 200));
  const sales: Sale[] = [];
  let n = 0;

  for (let back = days - 1; back >= 0; back--) {
    const day = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - back);
    const dow = day.getDay();
    // tendencia suave de crecimiento + estacionalidad de fin de mes
    const trend = 0.75 + 0.5 * ((days - back) / days);
    const payday = day.getDate() >= 28 || day.getDate() <= 2 ? 1.25 : 1;
    const expected = 7 * DOW_WEIGHT[dow] * trend * payday;
    const count = Math.max(1, Math.round(expected + (rand() - 0.5) * 5));

    for (let i = 0; i < count; i++) {
      const hour = pickWeighted(rand, HOURS, HOUR_W);
      const when = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, Math.floor(rand() * 60));
      const lines = 1 + Math.floor(rand() * rand() * 5);
      const used = new Set<string>();
      const items: Sale['items'] = [];
      for (let l = 0; l < lines; l++) {
        const p = pickWeighted(rand, sellable, weights);
        if (used.has(p.id)) continue;
        used.add(p.id);
        const qty = p.category === 'snacks' || p.category === 'mixers' ? 1 + Math.floor(rand() * 4) : 1 + Math.floor(rand() * rand() * 4);
        items.push({ productId: p.id, qty, price: p.price });
      }
      const payment = pickWeighted(rand, PAYMENTS, PAYMENT_W);
      const isToday = back === 0;
      const status: OrderStatus = isToday ? pickWeighted(rand, ['received', 'preparing', 'ready', 'delivered'] as OrderStatus[], [2, 2, 2, 4]) : 'delivered';
      n++;
      sales.push({
        id: `ML-${when.getFullYear()}${pad(when.getMonth() + 1)}${pad(when.getDate())}-${String(10000 + n * 7).slice(-5)}`,
        date: iso(when),
        items,
        total: items.reduce((a, it) => a + it.price * it.qty, 0),
        payment,
        status,
        source: payment === 'store' ? 'tienda' : 'web',
      });
    }
  }
  return sales;
}
