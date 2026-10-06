'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/format';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeCls = {
  sm: { box: 'h-9', btn: 'w-9', text: 'w-8 text-sm' },
  md: { box: 'h-11', btn: 'w-11', text: 'w-10 text-[15px]' },
  lg: { box: 'h-[52px]', btn: 'w-12', text: 'w-12 text-base' },
};

export default function QuantitySelector({ value, onChange, min = 1, max = 10, size = 'md', className, label = 'Cantidad' }: Props) {
  const s = sizeCls[size];
  return (
    <div className={cn('inline-flex items-center overflow-hidden rounded-xl border border-ink-200 bg-white', s.box, className)} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Disminuir cantidad"
        className={cn('grid h-full place-items-center text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent', s.btn)}
      >
        <Minus size={16} />
      </button>
      <span className={cn('select-none text-center font-bold tabular-nums', s.text)} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar cantidad"
        className={cn('grid h-full place-items-center text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent', s.btn)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
