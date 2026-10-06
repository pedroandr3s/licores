'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/format';

/** Paleta categórica (azul y naranja del logo + acentos). Nunca se usa solo el color: siempre hay etiqueta o valor. */
export const SERIES = ['#1a68a8', '#f5a623', '#2f9e6b', '#c93a5c', '#7b5cd6', '#14a0b5'];

const niceMax = (v: number) => {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
};

export function ChartCard({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('card p-4 sm:p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-ink-900">{title}</h3>
          {subtitle && <p className="text-[13px] text-ink-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function EmptyChart({ text = 'Sin datos con estos filtros' }: { text?: string }) {
  return <div className="grid h-40 place-items-center rounded-xl bg-ink-50 text-sm font-semibold text-ink-400">{text}</div>;
}

/* ───────────────────────── Línea / área ───────────────────────── */
export interface LinePoint {
  label: string;
  value: number;
  /** Serie secundaria opcional (se muestra en el tooltip) */
  extra?: number;
}

export function AreaChart({
  data,
  format,
  extraLabel,
  extraFormat,
  color = SERIES[0],
}: {
  data: LinePoint[];
  format: (n: number) => string;
  extraLabel?: string;
  extraFormat?: (n: number) => string;
  color?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  if (data.length === 0) return <EmptyChart />;

  const W = 720;
  const H = 240;
  const m = { l: 52, r: 12, t: 12, b: 28 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const x = (i: number) => m.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => m.t + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${m.t + ih} L${x(0).toFixed(1)} ${m.t + ih} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const step = Math.max(1, Math.ceil(data.length / 8));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - m.l) / iw) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  };

  const h = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none" role="img" aria-label="Gráfico de evolución" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`${uid}g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".28" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="#dcd9e8" strokeWidth="1" strokeDasharray={t === 0 ? undefined : '3 4'} />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6f6b8c">{format(t)}</text>
          </g>
        ))}
        {data.map((d, i) =>
          i % step === 0 ? (
            <text key={d.label + i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#6f6b8c">{d.label}</text>
          ) : null,
        )}
        <path d={area} fill={`url(#${uid}g)`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={m.t + ih} stroke="#938fae" strokeWidth="1" />
            <circle cx={x(hover)} cy={y(data[hover].value)} r="5" fill="#fff" stroke={color} strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl bg-ink-900 px-3 py-2 text-xs text-white shadow-pop"
          style={{ left: `${Math.min(88, Math.max(12, (x(hover) / W) * 100))}%` }}
        >
          <p className="font-bold text-ink-200">{h.label}</p>
          <p className="font-display text-base font-extrabold">{format(h.value)}</p>
          {h.extra !== undefined && extraLabel && <p className="text-ink-300">{extraFormat ? extraFormat(h.extra) : h.extra} {extraLabel}</p>}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Columnas ───────────────────────── */
export function ColumnChart({ data, format, color = SERIES[1] }: { data: { label: string; value: number }[]; format: (n: number) => string; color?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  if (data.length === 0 || data.every((d) => d.value === 0)) return <EmptyChart />;
  const W = 720;
  const H = 220;
  const m = { l: 40, r: 8, t: 12, b: 28 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const bw = iw / data.length;
  const step = Math.max(1, Math.ceil(data.length / 10));
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Gráfico de columnas" onPointerLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={m.t + ih - t * ih} y2={m.t + ih - t * ih} stroke="#dcd9e8" strokeDasharray={t === 0 ? undefined : '3 4'} />
            <text x={m.l - 6} y={m.t + ih - t * ih + 4} textAnchor="end" fontSize="11" fill="#6f6b8c">{format(t * max)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const h = (d.value / max) * ih;
          return (
            <g key={d.label + i} onPointerEnter={() => setHover(i)}>
              <rect x={m.l + i * bw} y={m.t} width={bw} height={ih} fill="transparent" />
              <rect x={m.l + i * bw + bw * 0.14} y={m.t + ih - h} width={bw * 0.72} height={Math.max(h, d.value > 0 ? 2 : 0)} rx="4" fill={color} opacity={hover === null || hover === i ? 1 : 0.45} />
              {i % step === 0 && <text x={m.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#6f6b8c">{d.label}</text>}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl bg-ink-900 px-3 py-2 text-xs text-white shadow-pop" style={{ left: `${Math.min(88, Math.max(12, ((m.l + hover * bw + bw / 2) / W) * 100))}%` }}>
          <p className="font-bold text-ink-200">{data[hover].label}</p>
          <p className="font-display text-base font-extrabold">{format(data[hover].value)}</p>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Barras horizontales ───────────────────────── */
export function HBars({ items, format, colorFor }: { items: { key: string; label: string; value: number; sub?: string }[]; format: (n: number) => string; colorFor?: (i: number) => string }) {
  if (items.length === 0) return <EmptyChart />;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={it.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-semibold text-ink-800" title={it.label}>{it.label}</span>
            <span className="shrink-0 font-bold tabular-nums text-ink-900">{format(it.value)}{it.sub && <span className="ml-1.5 font-medium text-ink-400">{it.sub}</span>}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(it.value / max) * 100}%`, background: colorFor ? colorFor(i) : SERIES[0] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── Dona ───────────────────────── */
export function Donut({ slices, format, centerLabel }: { slices: { key: string; label: string; value: number }[]; format: (n: number) => string; centerLabel?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (total === 0) return <EmptyChart />;
  const R = 64;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const active = hover !== null ? slices[hover] : null;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0 -rotate-90" role="img" aria-label="Gráfico de distribución" onPointerLeave={() => setHover(null)}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="#eceaf4" strokeWidth="22" />
          {slices.map((s, i) => {
            const len = (s.value / total) * C;
            const el = (
              <circle
                key={s.key}
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={SERIES[i % SERIES.length]}
                strokeWidth={hover === i ? 26 : 22}
                strokeDasharray={`${Math.max(len - 1.5, 0)} ${C}`}
                strokeDashoffset={-acc}
                onPointerEnter={() => setHover(i)}
                style={{ transition: 'stroke-width .15s' }}
              />
            );
            acc += len;
            return el;
          })}
        </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center" aria-hidden>
        <div>
          <p className="font-display text-lg font-extrabold leading-tight">{active ? format(active.value) : format(total)}</p>
          <p className="max-w-[88px] text-[11px] font-semibold leading-tight text-ink-500">{active ? active.label : centerLabel ?? 'Total'}</p>
        </div>
      </div>
      </div>
      <ul className="min-w-[160px] flex-1 space-y-2 text-sm">
        {slices.map((s, i) => (
          <li key={s.key} className="flex items-center gap-2.5" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: SERIES[i % SERIES.length] }} />
            <span className="min-w-0 flex-1 truncate font-semibold text-ink-800">{s.label}</span>
            <span className="tabular-nums text-ink-500">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── Mapa de calor ───────────────────────── */
const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function Heatmap({ rows, hours, max }: { rows: number[][]; hours: number[]; max: number }) {
  if (max === 0) return <EmptyChart />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center text-[11px]">
        <thead>
          <tr>
            <th />
            {hours.map((h) => (
              <th key={h} className="font-semibold text-ink-500">{h}h</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={DOW[ri]}>
              <th className="pr-1 text-right font-semibold text-ink-600">{DOW[ri]}</th>
              {r.map((v, ci) => (
                <td
                  key={ci}
                  title={`${DOW[ri]} ${hours[ci]}:00 — ${v} pedidos`}
                  className="h-7 rounded-md font-semibold tabular-nums"
                  style={{ background: v === 0 ? '#f6f5fa' : `rgba(26,104,168,${0.15 + (v / max) * 0.85})`, color: v / max > 0.5 ? '#fff' : '#3a3856' }}
                >
                  {v > 0 ? v : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
