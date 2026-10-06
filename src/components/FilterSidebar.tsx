'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/data/categories';
import { brands, products } from '@/data/products';
import { AVAIL_OPTIONS, DISCOUNT_OPTIONS, PRICE_RANGES, activeFilterCount, type AvailFlag, type CatalogFilters, type PriceRange } from '@/lib/catalog';
import { cn } from '@/lib/format';

interface Props {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onCategory: (slug: string) => void;
  onClear: () => void;
}

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-ink-100 py-4 first:pt-0 last:border-b-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-left">
        <h3 className="font-display text-base font-extrabold">{title}</h3>
        <ChevronDown size={18} className={cn('text-ink-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-[15px] hover:bg-ink-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-[18px] w-[18px] shrink-0 rounded border-ink-300 accent-brand-600" />
      <span className={cn('flex-1', checked && 'font-bold text-ink-900')}>{label}</span>
      {count !== undefined && <span className="text-xs text-ink-400">{count}</span>}
    </label>
  );
}

function Radio({ checked, onChange, label, name, count }: { checked: boolean; onChange: () => void; label: string; name: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-[15px] hover:bg-ink-50">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-[18px] w-[18px] shrink-0 accent-brand-600" />
      <span className={cn('flex-1', checked && 'font-bold text-ink-900')}>{label}</span>
      {count !== undefined && <span className="text-xs text-ink-400">{count}</span>}
    </label>
  );
}

export default function FilterSidebar({ filters, onChange, onCategory, onClear }: Props) {
  const [allBrands, setAllBrands] = useState(false);
  const count = activeFilterCount(filters);
  const brandCount = (b: string) => products.filter((p) => p.brand === b).length;
  const byPopularity = [...brands].sort((a, b) => brandCount(b) - brandCount(a) || a.localeCompare(b, 'es'));
  const top = byPopularity.slice(0, 8);
  // Las marcas seleccionadas siempre se ven, aunque no estén entre las más populares
  const shownBrands = allBrands ? byPopularity : [...top, ...filters.brands.filter((b) => !top.includes(b))];
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Filtros</h2>
        {count > 0 && (
          <button type="button" onClick={onClear} className="text-sm font-bold text-brand-700 hover:underline">Limpiar ({count})</button>
        )}
      </div>

      <Group title="Categoría">
        <div role="radiogroup" aria-label="Categoría">
          <Radio name="cat" checked={!filters.category} onChange={() => onCategory('')} label="Todas" count={products.length} />
          {categories.map((c) => (
            <Radio key={c.slug} name="cat" checked={filters.category === c.slug} onChange={() => onCategory(c.slug)} label={c.name} count={products.filter((p) => p.category === c.slug).length} />
          ))}
        </div>
      </Group>

      <Group title="Precio">
        <div role="radiogroup" aria-label="Precio">
          <Radio name="price" checked={!filters.price} onChange={() => onChange({ price: '' })} label="Todos los precios" />
          {PRICE_RANGES.map((r) => (
            <Radio key={r.id} name="price" checked={filters.price === r.id} onChange={() => onChange({ price: r.id as PriceRange })} label={r.label} />
          ))}
        </div>
      </Group>

      <Group title="Marca">
        <div>
          {shownBrands.map((b) => (
            <Check key={b} checked={filters.brands.includes(b)} onChange={() => onChange({ brands: toggle(filters.brands, b) })} label={b} count={brandCount(b)} />
          ))}
        </div>
        {brands.length > 8 && (
          <button type="button" onClick={() => setAllBrands((a) => !a)} className="mt-2 text-sm font-bold text-brand-700 hover:underline">
            {allBrands ? 'Ver menos marcas' : `Ver las ${brands.length} marcas`}
          </button>
        )}
      </Group>

      <Group title="Disponibilidad y tipo">
        {AVAIL_OPTIONS.map((o) => (
          <Check key={o.id} checked={filters.avail.includes(o.id)} onChange={() => onChange({ avail: toggle<AvailFlag>(filters.avail, o.id) })} label={o.label} />
        ))}
      </Group>

      <Group title="Descuento">
        <div role="radiogroup" aria-label="Descuento">
          {DISCOUNT_OPTIONS.map((o) => (
            <Radio key={o.value} name="disc" checked={filters.disc === o.value} onChange={() => onChange({ disc: o.value })} label={o.label} />
          ))}
        </div>
      </Group>
    </div>
  );
}
