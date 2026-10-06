import type { CategorySlug, Order, OrderStatus, PaymentMethod } from '@/types';
import type { Sale } from '@/data/sales';
import { getProduct } from '@/data/products';

export type PeriodDays = 7 | 30 | 90 | 180;
export type Granularity = 'day' | 'week' | 'month';

export interface AdminFilters {
  period: PeriodDays;
  category: '' | CategorySlug;
  payment: '' | PaymentMethod;
  status: '' | OrderStatus;
  alcohol: '' | 'alcohol' | 'noalcohol';
  q: string;
}

export const DEFAULT_ADMIN_FILTERS: AdminFilters = { period: 30, category: '', payment: '', status: '', alcohol: '', q: '' };

const pad = (n: number) => String(n).padStart(2, '0');
export const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseSale = (iso: string) => new Date(iso);

/** Convierte un pedido real de la demo en una venta para las estadísticas. */
export function orderToSale(o: Order): Sale {
  return {
    id: o.id,
    date: o.createdAt,
    items: o.items.map((i) => ({ productId: i.productId, qty: i.qty, price: i.price })),
    total: o.total,
    payment: o.payment.method,
    status: o.status,
    source: o.payment.method === 'store' ? 'tienda' : 'web',
  };
}

/** Línea de venta ya enriquecida con producto y categoría. */
export interface Line {
  sale: Sale;
  productId: string;
  name: string;
  category: CategorySlug;
  alcohol: boolean;
  qty: number;
  revenue: number;
}

export function toLines(sales: Sale[]): Line[] {
  const out: Line[] = [];
  for (const sale of sales) {
    for (const it of sale.items) {
      const p = getProduct(it.productId);
      if (!p) continue;
      out.push({ sale, productId: p.id, name: p.name, category: p.category, alcohol: p.isAlcohol, qty: it.qty, revenue: it.price * it.qty });
    }
  }
  return out;
}

export interface Window {
  from: Date;
  to: Date;
}

export function windowFor(period: PeriodDays, anchor: Date): { current: Window; previous: Window } {
  const to = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 23, 59, 59);
  const from = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - (period - 1));
  const pTo = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1, 23, 59, 59);
  const pFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate() - period);
  return { current: { from, to }, previous: { from: pFrom, to: pTo } };
}

/** Aplica filtros a una ventana de tiempo. Cuando hay filtros de producto, el total se recalcula sobre las líneas que coinciden. */
export function select(sales: Sale[], f: AdminFilters, w: Window): { lines: Line[]; sales: Sale[] } {
  const q = f.q.trim().toLowerCase();
  const inWindow = sales.filter((s) => {
    const d = parseSale(s.date);
    return d >= w.from && d <= w.to && (!f.payment || s.payment === f.payment) && (!f.status || s.status === f.status);
  });
  const lines = toLines(inWindow).filter(
    (l) =>
      (!f.category || l.category === f.category) &&
      (!f.alcohol || (f.alcohol === 'alcohol' ? l.alcohol : !l.alcohol)) &&
      (!q || l.name.toLowerCase().includes(q) || l.sale.id.toLowerCase().includes(q)),
  );
  const ids = new Set(lines.map((l) => l.sale.id));
  return { lines, sales: inWindow.filter((s) => ids.has(s.id)) };
}

export interface Kpis {
  revenue: number;
  orders: number;
  units: number;
  avgTicket: number;
  alcoholShare: number; // 0..1 (ingresos)
}

export function kpis(lines: Line[]): Kpis {
  const revenue = lines.reduce((a, l) => a + l.revenue, 0);
  const orders = new Set(lines.map((l) => l.sale.id)).size;
  const units = lines.reduce((a, l) => a + l.qty, 0);
  const alc = lines.filter((l) => l.alcohol).reduce((a, l) => a + l.revenue, 0);
  return { revenue, orders, units, avgTicket: orders ? revenue / orders : 0, alcoholShare: revenue ? alc / revenue : 0 };
}

export const delta = (cur: number, prev: number) => (prev === 0 ? (cur > 0 ? 1 : 0) : (cur - prev) / prev);

export interface SeriesPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function granularityFor(period: PeriodDays): Granularity {
  return period <= 30 ? 'day' : period <= 90 ? 'week' : 'month';
}

/** Serie temporal de ingresos y pedidos, rellenando períodos vacíos. */
export function timeSeries(lines: Line[], w: Window, g: Granularity): SeriesPoint[] {
  const buckets = new Map<string, SeriesPoint & { ids: Set<string> }>();
  const keyOf = (d: Date): { key: string; label: string; start: Date } => {
    if (g === 'day') return { key: dateKey(d), label: `${d.getDate()} ${MONTHS[d.getMonth()]}`, start: d };
    if (g === 'week') {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
      return { key: dateKey(start), label: `${start.getDate()} ${MONTHS[start.getMonth()]}`, start };
    }
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    return { key: dateKey(start), label: MONTHS[start.getMonth()], start };
  };
  // Relleno de períodos vacíos
  const cursor = new Date(w.from.getFullYear(), w.from.getMonth(), w.from.getDate());
  while (cursor <= w.to) {
    const k = keyOf(cursor);
    if (!buckets.has(k.key)) buckets.set(k.key, { key: k.key, label: k.label, revenue: 0, orders: 0, ids: new Set() });
    cursor.setDate(cursor.getDate() + 1);
  }
  for (const l of lines) {
    const k = keyOf(parseSale(l.sale.date));
    const b = buckets.get(k.key);
    if (!b) continue;
    b.revenue += l.revenue;
    if (!b.ids.has(l.sale.id)) {
      b.ids.add(l.sale.id);
      b.orders += 1;
    }
  }
  return [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key)).map(({ key, label, revenue, orders }) => ({ key, label, revenue, orders }));
}

export interface Slice {
  key: string;
  label: string;
  value: number;
}

export function byCategory(lines: Line[], labelOf: (c: CategorySlug) => string): Slice[] {
  const m = new Map<string, number>();
  for (const l of lines) m.set(l.category, (m.get(l.category) ?? 0) + l.revenue);
  return [...m.entries()].map(([key, value]) => ({ key, label: labelOf(key as CategorySlug), value })).sort((a, b) => b.value - a.value);
}

export function byPayment(sales: Sale[], lines: Line[], labelOf: (p: PaymentMethod) => string): Slice[] {
  const rev = new Map<string, number>();
  const payOf = new Map(sales.map((s) => [s.id, s.payment]));
  for (const l of lines) {
    const p = payOf.get(l.sale.id);
    if (p) rev.set(p, (rev.get(p) ?? 0) + l.revenue);
  }
  return [...rev.entries()].map(([key, value]) => ({ key, label: labelOf(key as PaymentMethod), value })).sort((a, b) => b.value - a.value);
}

export interface TopProduct {
  productId: string;
  name: string;
  revenue: number;
  units: number;
}

export function topProducts(lines: Line[], n = 8): TopProduct[] {
  const m = new Map<string, TopProduct>();
  for (const l of lines) {
    const cur = m.get(l.productId) ?? { productId: l.productId, name: l.name, revenue: 0, units: 0 };
    cur.revenue += l.revenue;
    cur.units += l.qty;
    m.set(l.productId, cur);
  }
  return [...m.values()].sort((a, b) => b.revenue - a.revenue).slice(0, n);
}

/** Matriz día de la semana (lun..dom) × hora con cantidad de pedidos. */
export function heatmap(sales: Sale[]): { rows: number[][]; hours: number[]; max: number } {
  const hours = Array.from({ length: 13 }, (_, i) => 11 + i); // 11..23
  const rows = Array.from({ length: 7 }, () => hours.map(() => 0));
  let max = 0;
  for (const s of sales) {
    const d = parseSale(s.date);
    const r = (d.getDay() + 6) % 7;
    const c = hours.indexOf(d.getHours());
    if (c < 0) continue;
    rows[r][c] += 1;
    max = Math.max(max, rows[r][c]);
  }
  return { rows, hours, max };
}

export function statusCounts(sales: Sale[]): Slice[] {
  const labels: Record<OrderStatus, string> = { received: 'Recibido', preparing: 'Preparando', ready: 'Listo para retiro', delivered: 'Retirado' };
  const m = new Map<OrderStatus, number>();
  for (const s of sales) m.set(s.status, (m.get(s.status) ?? 0) + 1);
  return (Object.keys(labels) as OrderStatus[]).map((k) => ({ key: k, label: labels[k], value: m.get(k) ?? 0 }));
}

/** Distribución del ticket por rangos. */
export function ticketBuckets(sales: Sale[]): Slice[] {
  const ranges: [string, number, number][] = [
    ['< $5.000', 0, 5000],
    ['$5-10 mil', 5000, 10000],
    ['$10-20 mil', 10000, 20000],
    ['$20-40 mil', 20000, 40000],
    ['> $40 mil', 40000, Infinity],
  ];
  return ranges.map(([label, lo, hi]) => ({ key: label, label, value: sales.filter((s) => s.total >= lo && s.total < hi).length }));
}
