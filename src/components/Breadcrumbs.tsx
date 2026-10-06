import Link from 'next/link';
import { ChevronRight, House } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-500">
        <li>
          <Link href="/" className="inline-flex items-center gap-1 font-semibold hover:text-brand-700">
            <House size={14} /> Inicio
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
            <ChevronRight size={14} className="text-ink-300" />
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="font-semibold hover:text-brand-700">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink-800">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
