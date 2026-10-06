'use client';

import { Check, Clock, MapPin, Navigation } from 'lucide-react';
import type { Availability, Product, Store } from '@/types';
import { stores, storeStatus } from '@/data/stores';
import { availabilityLabel, availabilityStyle, cartStoreAvailability, storeAvailability } from '@/lib/availability';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/format';

interface Props {
  value: string | null;
  onChange: (storeId: string) => void;
  /** Disponibilidad para un producto específico (ficha de producto) */
  product?: Product;
  /** Disponibilidad para varios productos (checkout) */
  cartProducts?: Product[];
  compact?: boolean;
  name?: string;
}

export default function StoreSelector({ value, onChange, product, cartProducts, compact, name = 'store' }: Props) {
  const mounted = useMounted();
  const now = mounted ? new Date() : null;

  const availabilityOf = (s: Store): Availability | null => {
    if (product) return storeAvailability(product, s.id);
    if (cartProducts) return cartStoreAvailability(cartProducts, s.id);
    return null;
  };

  return (
    <div role="radiogroup" aria-label="Selecciona una tienda" className="grid gap-2.5">
      {stores.map((s) => {
        const a = availabilityOf(s);
        const disabled = a === 'none';
        const selected = value === s.id;
        const status = now ? storeStatus(s, now) : null;
        return (
          <label
            key={s.id}
            className={cn(
              'relative flex cursor-pointer gap-3 rounded-2xl border bg-white p-3.5 transition',
              selected ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/20' : 'border-ink-200 hover:border-brand-300',
              disabled && 'cursor-not-allowed opacity-60 hover:border-ink-200',
            )}
          >
            <input
              type="radio"
              name={name}
              value={s.id}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(s.id)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
                selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300',
              )}
            >
              {selected && <Check size={12} strokeWidth={3.5} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="font-bold text-ink-900">{s.name}</span>
                {a && <span className={cn('badge', availabilityStyle[a])}>{availabilityLabel[a]}</span>}
              </span>
              <span className="mt-1 flex items-start gap-1.5 text-sm text-ink-600">
                <MapPin size={14} className="mt-[3px] shrink-0 text-ink-400" /> {s.address}
              </span>
              {!compact && (
                <span className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-600">
                  <Clock size={14} className="shrink-0 text-ink-400" /> {s.hoursLabel}
                </span>
              )}
              <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <Navigation size={12} /> a {s.distanceKm.toLocaleString('es-CL')} km
                </span>
                {status && (
                  <span className={cn('inline-flex items-center gap-1 font-semibold', status.open ? 'text-mint-700' : 'text-ink-500')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', status.open ? 'bg-mint-500' : 'bg-ink-300')} />
                    {status.label}
                  </span>
                )}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
