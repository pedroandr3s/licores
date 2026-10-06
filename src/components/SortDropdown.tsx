'use client';

import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS, type SortKey } from '@/lib/catalog';

export default function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="sort-select" className="mr-2 hidden whitespace-nowrap text-sm font-semibold text-ink-500 sm:block">Ordenar por</label>
      <div className="relative">
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="h-11 appearance-none rounded-xl border border-ink-200 bg-white py-0 pl-3.5 pr-10 text-[15px] font-bold text-ink-800 outline-none transition hover:border-ink-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" />
      </div>
    </div>
  );
}
