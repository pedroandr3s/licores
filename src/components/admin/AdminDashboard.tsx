'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Download, Lock, LogOut, Package, RotateCcw, ShieldCheck, ShoppingBag, TrendingDown, TrendingUp, Wallet, Wine, Receipt } from 'lucide-react';
import { categories, categoryMap } from '@/data/categories';
import { generateSales } from '@/data/sales';
import { useStore } from '@/context/StoreContext';
import { useMounted } from '@/hooks/useMounted';
import { formatCLP, formatNumber, cn } from '@/lib/format';
import { formatDateTime } from '@/lib/dates';
import { PAYMENT_LABEL, STATUS_LABEL, STATUS_STYLE } from '@/lib/orders';
import {
  DEFAULT_ADMIN_FILTERS, byCategory, byPayment, delta, granularityFor, heatmap, kpis, orderToSale, select, statusCounts, ticketBuckets, timeSeries, topProducts, windowFor,
  type AdminFilters, type PeriodDays,
} from '@/lib/analytics';
import type { OrderStatus, PaymentMethod } from '@/types';
import Breadcrumbs from '../Breadcrumbs';
import { AreaChart, ChartCard, ColumnChart, Donut, HBars, Heatmap, SERIES } from './charts';
import AdminInventory from './AdminInventory';

const SESSION_KEY = 'oasis:admin';
/** Contraseña de la demo: no hay servidor, por lo que esto NO es seguridad real. */
const DEMO_PASSWORD = 'admin123';

const PERIODS: { id: PeriodDays; label: string }[] = [
  { id: 7, label: '7 días' },
  { id: 30, label: '30 días' },
  { id: 90, label: '90 días' },
  { id: 180, label: '6 meses' },
];

const GRAN_LABEL = { day: 'por día', week: 'por semana', month: 'por mes' } as const;

function KpiCard({ icon: Icon, label, value, change, tone }: { icon: typeof Wallet; label: string; value: string; change?: number; tone: string }) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', tone)}><Icon size={20} /></span>
        {change !== undefined && (
          <span className={cn('badge', up ? 'bg-mint-50 text-mint-700' : 'bg-coral-50 text-coral-700')} title="Variación respecto del período anterior">
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {up ? '+' : ''}{(change * 100).toFixed(1).replace('.', ',')}%
          </span>
        )}
      </div>
      <p className="mt-3 text-[13px] font-semibold text-ink-500">{label}</p>
      <p className="font-display text-[26px] font-extrabold leading-tight">{value}</p>
    </div>
  );
}

function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-10">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === DEMO_PASSWORD) onOk();
          else setErr('Contraseña incorrecta');
        }}
        className="card w-full max-w-sm p-6 sm:p-8"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Lock size={24} /></span>
        <h1 className="mt-4 text-2xl font-extrabold">Panel de administración</h1>
        <p className="mt-1 text-sm text-ink-500">Acceso para el equipo de Botillería Oasis.</p>
        <label htmlFor="admin-pw" className="label mt-5">Contraseña</label>
        <input id="admin-pw" type="password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr(''); }} className={cn('input', err && 'input-error')} autoComplete="off" />
        {err && <p className="field-error">{err}</p>}
        <button type="submit" className="btn btn-primary mt-5 w-full">Entrar</button>
        <button type="button" onClick={() => { setPw(DEMO_PASSWORD); setErr(''); }} className="mt-3 w-full text-center text-sm font-bold text-brand-700 hover:underline">
          Usar contraseña de demostración
        </button>
        <p className="mt-4 flex items-start gap-1.5 text-xs text-ink-400"><ShieldCheck size={14} className="mt-0.5 shrink-0" /> Demostración sin servidor: este acceso no es seguridad real.</p>
      </form>
    </div>
  );
}

function SelectBox<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-ink-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="input h-10 text-sm">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export default function AdminDashboard() {
  const mounted = useMounted();
  const { orders, hydrated } = useStore();
  const [auth, setAuth] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'ventas' | 'inventario'>('ventas');
  const [f, setF] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    try {
      setAuth(window.sessionStorage.getItem(SESSION_KEY) === '1');
    } catch {
      setAuth(false);
    }
  }, []);

  const anchor = useMemo(() => new Date(), []);
  const sales = useMemo(() => {
    const real = orders.map(orderToSale);
    const ids = new Set(real.map((r) => r.id));
    return [...generateSales(anchor, 180).filter((g) => !ids.has(g.id)), ...real];
  }, [orders, anchor]);

  const win = useMemo(() => windowFor(f.period, anchor), [f.period, anchor]);
  const cur = useMemo(() => select(sales, f, win.current), [sales, f, win]);
  const prev = useMemo(() => select(sales, f, win.previous), [sales, f, win]);
  const k = useMemo(() => kpis(cur.lines), [cur]);
  const kp = useMemo(() => kpis(prev.lines), [prev]);
  const gran = granularityFor(f.period);
  const series = useMemo(() => timeSeries(cur.lines, win.current, gran), [cur, win, gran]);
  const cats = useMemo(() => byCategory(cur.lines, (c) => categoryMap[c].name), [cur]);
  const pays = useMemo(() => byPayment(cur.sales, cur.lines, (p) => PAYMENT_LABEL[p]), [cur]);
  const top = useMemo(() => topProducts(cur.lines, 8), [cur]);
  const heat = useMemo(() => heatmap(cur.sales), [cur]);
  const status = useMemo(() => statusCounts(cur.sales), [cur]);
  const tickets = useMemo(() => ticketBuckets(cur.sales), [cur]);
  const alcSplit = useMemo(() => {
    const a = cur.lines.filter((l) => l.alcohol).reduce((s, l) => s + l.revenue, 0);
    const b = cur.lines.filter((l) => !l.alcohol).reduce((s, l) => s + l.revenue, 0);
    return [{ key: 'alc', label: 'Con alcohol', value: a }, { key: 'sin', label: 'Sin alcohol (bebidas y snacks)', value: b }];
  }, [cur]);
  const recent = useMemo(() => [...cur.sales].sort((a, b) => b.date.localeCompare(a.date)), [cur]);

  if (!mounted || !hydrated || auth === null) {
    return <div className="container-page py-10"><div className="skeleton h-72" /></div>;
  }
  if (!auth) {
    return <Login onOk={() => { try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* sin almacenamiento */ } setAuth(true); }} />;
  }

  const set = <K extends keyof AdminFilters>(key: K, v: AdminFilters[K]) => { setF((p) => ({ ...p, [key]: v })); setRows(10); };
  const dirty = f.category || f.payment || f.status || f.alcohol || f.q;

  const exportCsv = () => {
    const head = ['Pedido', 'Fecha', 'Unidades', 'Total', 'Pago', 'Estado'];
    const body = recent.map((s) => [s.id, s.date, s.items.reduce((a, i) => a + i.qty, 0), s.total, PAYMENT_LABEL[s.payment], STATUS_LABEL[s.status]]);
    const csv = [head, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas-oasis-${f.period}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Administración' }]} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold md:text-4xl">Panel de administración</h1>
          <p className="text-ink-500">Ventas, inventario y comportamiento de compra. Incluye los pedidos que hagas en esta demo.</p>
        </div>
        <button type="button" onClick={() => { try { window.sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ } setAuth(false); }} className="btn btn-outline btn-sm"><LogOut size={16} /> Salir</button>
      </div>

      <div role="tablist" aria-label="Secciones del panel" className="mt-5 flex gap-1 border-b border-ink-200">
        {([['ventas', 'Ventas', BarChart3], ['inventario', 'Inventario y stock', Package]] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('relative inline-flex items-center gap-2 px-4 py-3 text-[15px] font-bold', tab === id ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800')}>
            <Icon size={18} /> {label}
            {tab === id && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-brand-600" />}
          </button>
        ))}
      </div>

      {tab === 'inventario' ? (
        <div className="mt-6"><AdminInventory sales={sales} /></div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Filtros */}
          <section className="card p-4" aria-label="Filtros">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-bold text-ink-600">Período</span>
              {PERIODS.map((p) => (
                <button key={p.id} type="button" aria-pressed={f.period === p.id} onClick={() => set('period', p.id)} className={cn('chip', f.period === p.id && 'chip-active')}>{p.label}</button>
              ))}
              {dirty && (
                <button type="button" onClick={() => { setF({ ...DEFAULT_ADMIN_FILTERS, period: f.period }); setRows(10); }} className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline"><RotateCcw size={14} /> Limpiar filtros</button>
              )}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <SelectBox label="Categoría" value={f.category} onChange={(v) => set('category', v)} options={[{ value: '', label: 'Todas' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} />
              <SelectBox label="Método de pago" value={f.payment} onChange={(v) => set('payment', v as '' | PaymentMethod)} options={[{ value: '', label: 'Todos' }, ...(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((p) => ({ value: p, label: PAYMENT_LABEL[p] }))]} />
              <SelectBox label="Estado del pedido" value={f.status} onChange={(v) => set('status', v as '' | OrderStatus)} options={[{ value: '', label: 'Todos' }, ...(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] }))]} />
              <SelectBox label="Tipo de producto" value={f.alcohol} onChange={(v) => set('alcohol', v)} options={[{ value: '', label: 'Todos' }, { value: 'alcohol', label: 'Con alcohol' }, { value: 'noalcohol', label: 'Sin alcohol' }]} />
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-ink-500">Buscar producto o pedido</span>
                <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Ej.: pisco, ML-2026…" className="input h-10 text-sm" />
              </label>
            </div>
          </section>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            <KpiCard icon={Wallet} label="Ingresos" value={formatCLP(k.revenue)} change={delta(k.revenue, kp.revenue)} tone="bg-brand-50 text-brand-600" />
            <KpiCard icon={Receipt} label="Pedidos" value={formatNumber(k.orders)} change={delta(k.orders, kp.orders)} tone="bg-sun-100 text-[#8a5a00]" />
            <KpiCard icon={ShoppingBag} label="Ticket promedio" value={formatCLP(k.avgTicket)} change={delta(k.avgTicket, kp.avgTicket)} tone="bg-mint-50 text-mint-700" />
            <KpiCard icon={Package} label="Unidades vendidas" value={formatNumber(k.units)} change={delta(k.units, kp.units)} tone="bg-ink-100 text-ink-700" />
            <KpiCard icon={Wine} label="Ventas con alcohol" value={`${Math.round(k.alcoholShare * 100)}%`} tone="bg-coral-50 text-coral-600" />
          </div>

          {/* Gráficos */}
          <ChartCard title="Evolución de ingresos" subtitle={`Ingresos ${GRAN_LABEL[gran]} · pasa el cursor para ver el detalle`}>
            <AreaChart data={series.map((s) => ({ label: s.label, value: s.revenue, extra: s.orders }))} format={formatCLP} extraLabel="pedidos" />
          </ChartCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Pedidos" subtitle={`Cantidad de pedidos ${GRAN_LABEL[gran]}`}>
              <ColumnChart data={series.map((s) => ({ label: s.label, value: s.orders }))} format={(n) => formatNumber(n)} />
            </ChartCard>
            <ChartCard title="Ventas por categoría" subtitle="Ingresos del período">
              <HBars items={cats} format={formatCLP} colorFor={(i) => SERIES[i % SERIES.length]} />
            </ChartCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard title="Métodos de pago" subtitle="Ingresos por medio de pago"><Donut slices={pays} format={formatCLP} centerLabel="Ingresos" /></ChartCard>
            <ChartCard title="Alcohol vs. otros" subtitle="Peso en los ingresos"><Donut slices={alcSplit} format={formatCLP} centerLabel="Ingresos" /></ChartCard>
            <ChartCard title="Estado de los pedidos" subtitle="Cantidad de pedidos por estado">
              <HBars items={status} format={(n) => formatNumber(n)} colorFor={(i) => ['#1a68a8', '#f5a623', '#2f9e6b', '#938fae'][i]} />
            </ChartCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Productos más vendidos" subtitle="Por ingresos"><HBars items={top.map((t) => ({ key: t.productId, label: t.name, value: t.revenue, sub: `${formatNumber(t.units)} u.` }))} format={formatCLP} /></ChartCard>
            <ChartCard title="Tamaño de los pedidos" subtitle="Cantidad de pedidos por rango de monto"><ColumnChart data={tickets.map((t) => ({ label: t.label, value: t.value }))} format={(n) => formatNumber(n)} color={SERIES[2]} /></ChartCard>
          </div>

          <ChartCard title="Horas y días de mayor venta" subtitle="Pedidos por día de la semana y hora: útil para planificar turnos y reposición">
            <Heatmap {...heat} />
          </ChartCard>

          {/* Tabla */}
          <section className="card p-4 sm:p-5" aria-label="Pedidos">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold">Pedidos del período</h3>
                <p className="text-[13px] text-ink-500">{formatNumber(recent.length)} pedidos con los filtros actuales</p>
              </div>
              <button type="button" onClick={exportCsv} disabled={recent.length === 0} className="btn btn-outline btn-sm"><Download size={16} /> Exportar CSV</button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-[13px] text-ink-500">
                    <th className="py-2 pr-3 font-semibold">Pedido</th>
                    <th className="px-3 py-2 font-semibold">Fecha</th>
                    <th className="px-3 py-2 text-right font-semibold">Unidades</th>
                    <th className="px-3 py-2 text-right font-semibold">Total</th>
                    <th className="px-3 py-2 font-semibold">Pago</th>
                    <th className="py-2 pl-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {recent.slice(0, rows).map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 pr-3 font-bold">{orders.some((o) => o.id === s.id) ? <Link href={`/mis-pedidos/${s.id}`} className="text-brand-700 hover:underline">{s.id}</Link> : s.id}</td>
                      <td className="px-3 py-2.5 text-ink-600">{formatDateTime(s.date)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{s.items.reduce((a, i) => a + i.qty, 0)}</td>
                      <td className="px-3 py-2.5 text-right font-bold tabular-nums">{formatCLP(s.total)}</td>
                      <td className="px-3 py-2.5 text-ink-600">{PAYMENT_LABEL[s.payment]}</td>
                      <td className="py-2.5 pl-3"><span className={cn('badge', STATUS_STYLE[s.status])}>{STATUS_LABEL[s.status]}</span></td>
                    </tr>
                  ))}
                  {recent.length === 0 && <tr><td colSpan={6} className="py-10 text-center font-semibold text-ink-400">Sin pedidos con estos filtros</td></tr>}
                </tbody>
              </table>
            </div>
            {recent.length > rows && <div className="mt-4 text-center"><button type="button" onClick={() => setRows((r) => r + 10)} className="btn btn-outline btn-sm">Mostrar más</button></div>}
          </section>
        </div>
      )}
    </div>
  );
}
