'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Minus, PackageCheck, PackageX, Plus, Search, Warehouse } from 'lucide-react';
import { categories, categoryMap } from '@/data/categories';
import { getBaseStock, getProduct, LOW_STOCK, products } from '@/data/products';
import type { Sale } from '@/data/sales';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { formatCLP, formatNumber, cn } from '@/lib/format';
import { formatDateTime } from '@/lib/dates';
import { toLines } from '@/lib/analytics';
import { ChartCard, Donut, HBars, SERIES } from './charts';

type StatusFilter = '' | 'out' | 'low' | 'ok';

const REORDER_TARGET = 40;

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="badge bg-coral-50 text-coral-700">Agotado</span>;
  if (stock <= LOW_STOCK) return <span className="badge bg-sun-100 text-[#8a5a00]">Stock bajo</span>;
  return <span className="badge bg-mint-50 text-mint-700">Normal</span>;
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Warehouse; label: string; value: string; tone: string }) {
  return (
    <div className="card flex items-center gap-3.5 p-4">
      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', tone)}><Icon size={22} /></span>
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-ink-500">{label}</p>
        <p className="font-display text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

function StockEditor({ id, stock }: { id: string; stock: number }) {
  const { dispatch } = useStore();
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const n = Number(draft);
    if (Number.isFinite(n) && n >= 0) dispatch({ type: 'STOCK_SET', productId: id, qty: n, reason: n > stock ? 'reposicion' : 'ajuste' });
    setDraft(null);
  };
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" aria-label="Quitar 1 unidad" disabled={stock <= 0} onClick={() => dispatch({ type: 'STOCK_SET', productId: id, qty: stock - 1, reason: 'ajuste' })} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 bg-white text-ink-600 hover:border-brand-400 disabled:opacity-40">
        <Minus size={15} />
      </button>
      <input
        aria-label="Stock"
        inputMode="numeric"
        value={draft ?? String(stock)}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 5))}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setDraft(null); }}
        className="h-8 w-16 rounded-lg border border-ink-200 bg-white text-center text-sm font-bold tabular-nums focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <button type="button" aria-label="Agregar 1 unidad" onClick={() => dispatch({ type: 'STOCK_SET', productId: id, qty: stock + 1, reason: 'reposicion' })} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 bg-white text-ink-600 hover:border-brand-400">
        <Plus size={15} />
      </button>
      <button type="button" onClick={() => dispatch({ type: 'STOCK_SET', productId: id, qty: stock + 12, reason: 'reposicion' })} className="h-8 rounded-lg bg-brand-50 px-2.5 text-xs font-bold text-brand-700 hover:bg-brand-100">
        +12
      </button>
    </div>
  );
}

export default function AdminInventory({ sales }: { sales: Sale[] }) {
  const { stock, stockLog, dispatch } = useStore();
  const { toast } = useUI();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [limit, setLimit] = useState(15);

  const live = (id: string) => stock[id] ?? getBaseStock(id);
  const rows = products.map((p) => ({ p, stock: live(p.id) }));

  const totals = useMemo(() => {
    const units = rows.reduce((a, r) => a + r.stock, 0);
    const value = rows.reduce((a, r) => a + r.stock * r.p.price, 0);
    const out = rows.filter((r) => r.stock <= 0).length;
    const low = rows.filter((r) => r.stock > 0 && r.stock <= LOW_STOCK).length;
    return { units, value, out, low };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock]);

  // Venta diaria promedio de los últimos 30 días (para estimar la cobertura)
  const daily = useMemo(() => {
    const from = Date.now() - 30 * 86400000;
    const m = new Map<string, number>();
    for (const l of toLines(sales.filter((s) => new Date(s.date).getTime() >= from))) m.set(l.productId, (m.get(l.productId) ?? 0) + l.qty);
    return m;
  }, [sales]);
  const coverage = (id: string, s: number) => {
    const rate = (daily.get(id) ?? 0) / 30;
    return rate > 0 ? s / rate : Infinity;
  };

  const filtered = rows
    .filter((r) => (!cat || r.p.category === cat) && (!q.trim() || r.p.name.toLowerCase().includes(q.trim().toLowerCase()) || r.p.sku.toLowerCase().includes(q.trim().toLowerCase())))
    .filter((r) => (status === 'out' ? r.stock <= 0 : status === 'low' ? r.stock > 0 && r.stock <= LOW_STOCK : status === 'ok' ? r.stock > LOW_STOCK : true))
    .sort((a, b) => a.stock - b.stock);

  const byCat = categories.map((c) => ({ key: c.slug, label: c.name, value: rows.filter((r) => r.p.category === c.slug).reduce((a, r) => a + r.stock, 0) }));
  const valueByCat = categories.map((c) => ({ key: c.slug, label: c.name, value: rows.filter((r) => r.p.category === c.slug).reduce((a, r) => a + r.stock * r.p.price, 0) })).sort((a, b) => b.value - a.value);
  const lowCover = rows
    .map((r) => ({ key: r.p.id, label: r.p.name, days: coverage(r.p.id, r.stock) }))
    .filter((r) => Number.isFinite(r.days))
    .sort((a, b) => a.days - b.days)
    .slice(0, 8)
    .map((r) => ({ key: r.key, label: r.label, value: Math.round(r.days * 10) / 10 }));

  const critical = rows.filter((r) => r.stock <= LOW_STOCK);
  const restockCritical = () => {
    critical.forEach((r) => dispatch({ type: 'STOCK_SET', productId: r.p.id, qty: REORDER_TARGET, reason: 'reposicion' }));
    toast({ type: 'success', title: 'Reposición realizada', description: `${critical.length} productos repuestos a ${REORDER_TARGET} unidades.` });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Warehouse} label="Unidades en stock" value={formatNumber(totals.units)} tone="bg-brand-50 text-brand-600" />
        <Kpi icon={PackageCheck} label="Valor del inventario" value={formatCLP(totals.value)} tone="bg-mint-50 text-mint-700" />
        <Kpi icon={AlertTriangle} label={`Stock bajo (≤ ${LOW_STOCK})`} value={String(totals.low)} tone="bg-sun-100 text-[#8a5a00]" />
        <Kpi icon={PackageX} label="Agotados" value={String(totals.out)} tone="bg-coral-50 text-coral-600" />
      </div>

      {critical.length > 0 && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sun-300 bg-sun-100/60 p-4">
          <p className="flex items-start gap-2.5 text-sm font-semibold text-[#6b4700]">
            <AlertTriangle size={19} className="mt-0.5 shrink-0" />
            {critical.length} {critical.length === 1 ? 'producto necesita' : 'productos necesitan'} reposición: {critical.slice(0, 3).map((r) => r.p.name).join(', ')}{critical.length > 3 ? '…' : ''}
          </p>
          <button type="button" onClick={restockCritical} className="btn btn-sun btn-sm">Reponer a {REORDER_TARGET} unidades</button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Unidades por categoría" subtitle="Stock actual">
          <HBars items={byCat} format={(n) => `${formatNumber(n)} u.`} colorFor={(i) => SERIES[i % SERIES.length]} />
        </ChartCard>
        <ChartCard title="Valor del inventario" subtitle="A precio de venta">
          <Donut slices={valueByCat} format={formatCLP} centerLabel="Valor total" />
        </ChartCard>
        <ChartCard title="Menor cobertura" subtitle="Días de stock según ventas de 30 días">
          <HBars items={lowCover} format={(n) => `${String(n).replace('.', ',')} d`} colorFor={(i) => (lowCover[i].value < 7 ? '#c93a5c' : lowCover[i].value < 14 ? '#f5a623' : '#2f9e6b')} />
        </ChartCard>
      </div>

      <section className="card p-4 sm:p-5" aria-label="Control de stock">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold">Control de stock</h3>
            <p className="text-[13px] text-ink-500">Cada compra descuenta unidades automáticamente. Edita aquí el stock o repón mercadería.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(15); }} placeholder="Buscar producto o SKU" aria-label="Buscar producto" className="input h-10 w-56 pl-9 text-sm" />
            </div>
            <select value={cat} onChange={(e) => { setCat(e.target.value); setLimit(15); }} aria-label="Categoría" className="input h-10 w-auto text-sm">
              <option value="">Todas las categorías</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <select value={status} onChange={(e) => { setStatus(e.target.value as StatusFilter); setLimit(15); }} aria-label="Estado de stock" className="input h-10 w-auto text-sm">
              <option value="">Todo el stock</option>
              <option value="out">Agotados</option>
              <option value="low">Stock bajo</option>
              <option value="ok">Normal</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-[13px] text-ink-500">
                <th className="py-2 pr-3 font-semibold">Producto</th>
                <th className="px-3 py-2 font-semibold">Categoría</th>
                <th className="px-3 py-2 text-right font-semibold">Precio</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 text-right font-semibold">Cobertura</th>
                <th className="py-2 pl-3 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.slice(0, limit).map(({ p, stock: s }) => {
                const cov = coverage(p.id, s);
                return (
                  <tr key={p.id}>
                    <td className="py-2.5 pr-3"><p className="max-w-[260px] truncate font-bold" title={p.name}>{p.name}</p><p className="text-xs text-ink-400">{p.sku} · {p.brand}</p></td>
                    <td className="px-3 py-2.5 text-ink-600">{categoryMap[p.category].name}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{formatCLP(p.price)}</td>
                    <td className="px-3 py-2.5"><StockBadge stock={s} /></td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-600">{Number.isFinite(cov) ? `${Math.round(cov)} d` : '—'}</td>
                    <td className="py-2.5 pl-3"><StockEditor id={p.id} stock={s} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-10 text-center font-semibold text-ink-400">Ningún producto coincide con los filtros</td></tr>}
            </tbody>
          </table>
        </div>
        {filtered.length > limit && (
          <div className="mt-4 text-center"><button type="button" onClick={() => setLimit((l) => l + 15)} className="btn btn-outline btn-sm">Mostrar más ({filtered.length - limit})</button></div>
        )}
      </section>

      <ChartCard title="Movimientos recientes" subtitle="Ventas, ajustes y reposiciones registradas en esta demo">
        {stockLog.length === 0 ? (
          <p className="rounded-xl bg-ink-50 p-6 text-center text-sm font-semibold text-ink-400">Aún no hay movimientos. Haz una compra o ajusta el stock para verlos aquí.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {stockLog.slice(0, 12).map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate font-semibold">{getProduct(m.productId)?.name ?? m.productId}</span>
                <span className="text-ink-500">{m.reason === 'venta' ? `Venta ${m.ref ?? ''}` : m.reason === 'reposicion' ? 'Reposición' : 'Ajuste'} · {formatDateTime(m.date)}</span>
                <span className={cn('w-14 text-right font-bold tabular-nums', m.delta < 0 ? 'text-coral-600' : 'text-mint-700')}>{m.delta > 0 ? '+' : ''}{m.delta}</span>
                <span className="w-20 text-right text-ink-400">→ {m.after} u.</span>
              </li>
            ))}
          </ul>
        )}
      </ChartCard>
    </div>
  );
}
