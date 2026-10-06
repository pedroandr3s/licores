'use client';

import { MapPin } from 'lucide-react';
import { stores } from '@/data/stores';
import { cn } from '@/lib/format';

interface Props {
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

/** Mapa ilustrado (sin servicios externos) con la ubicación aproximada de cada tienda. */
export default function StoreMap({ activeId, onSelect, className }: Props) {
  return (
    <div className={cn('relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-100 bg-[#eaf3e4] shadow-card', className)} role="group" aria-label="Mapa de tiendas">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="400" height="300" fill="#eaf3e4" />
        <path d="M0 210 C60 190 90 240 160 224 C230 208 260 150 330 160 C370 166 390 150 400 140 V300 H0 Z" fill="#dcead2" />
        <path d="M-10 60 C50 90 110 40 170 70 C230 100 270 50 410 90 V0 H-10 Z" fill="#d6e8ef" opacity=".7" />
        <path d="M0 150 C80 120 150 170 230 130 S350 90 400 110" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
        <path d="M60 300 C80 220 140 190 190 130 S240 20 270 0" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <path d="M0 150 C80 120 150 170 230 130 S350 90 400 110" fill="none" stroke="#ffd98a" strokeWidth="2.5" strokeDasharray="10 8" strokeLinecap="round" />
        <path d="M200 300 C230 240 300 220 330 180 S380 150 400 150" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        {[[70, 60], [310, 40], [350, 240], [120, 260], [260, 250]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="16" fill="#cfe3c2" />
        ))}
      </svg>
      {stores.map((s) => {
        const active = activeId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect?.(s.id)}
            aria-label={`${s.name}${active ? ' (seleccionada)' : ''}`}
            aria-pressed={active}
            className="group absolute -translate-x-1/2 -translate-y-full focus-visible:z-20"
            style={{ left: `${s.map.x}%`, top: `${s.map.y}%`, zIndex: active ? 10 : 1 }}
          >
            <span className={cn('mb-1 block whitespace-nowrap rounded-lg px-2 py-1 text-xs font-bold shadow-md transition', active ? 'bg-ink-900 text-white' : 'bg-white text-ink-800 group-hover:bg-ink-900 group-hover:text-white')}>{s.shortName}</span>
            <span className={cn('mx-auto grid h-9 w-9 place-items-center rounded-full border-[3px] border-white shadow-lg transition-transform', active ? 'scale-125 bg-coral-500 text-white' : 'bg-brand-600 text-white group-hover:scale-110')}>
              <MapPin size={17} />
            </span>
          </button>
        );
      })}
      <p className="absolute bottom-2 left-3 rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-ink-500">Mapa ilustrativo</p>
    </div>
  );
}
