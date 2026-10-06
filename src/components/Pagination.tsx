'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/format';

interface Props {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

function range(page: number, pages: number): (number | '…')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) out.push('…');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < pages - 1) out.push('…');
  out.push(pages);
  return out;
}

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;
  const btn = 'grid h-10 min-w-10 place-items-center rounded-xl border px-3 text-sm font-bold transition';
  return (
    <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-1.5">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Página anterior" className={cn(btn, 'border-ink-200 bg-white text-ink-700 hover:border-brand-400 disabled:opacity-40 disabled:hover:border-ink-200')}>
        <ChevronLeft size={18} />
      </button>
      {range(page, pages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-ink-400">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(btn, p === page ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-brand-400')}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Página siguiente" className={cn(btn, 'border-ink-200 bg-white text-ink-700 hover:border-brand-400 disabled:opacity-40 disabled:hover:border-ink-200')}>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
