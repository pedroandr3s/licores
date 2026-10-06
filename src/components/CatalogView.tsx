'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PackageSearch, SlidersHorizontal, X } from 'lucide-react';
import { categories, getCategory } from '@/data/categories';
import {
  PRICE_RANGES, applyFilters, activeFilterCount, paginate, parseFilters, toQuery, AVAIL_OPTIONS, type CatalogFilters,
} from '@/lib/catalog';
import { useSimulatedLoading } from '@/hooks/useMounted';
import { cn } from '@/lib/format';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import Drawer from './ui/Drawer';
import { ProductGridSkeleton } from './Skeletons';

interface Props {
  /** Categoría fija por ruta (/productos/[categoria]) */
  categoria?: string;
  /** Título/forzado para secciones como "Nuevos" */
  mode?: 'catalog' | 'new';
}

export default function CatalogView({ categoria = '', mode = 'catalog' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const filters = useMemo(() => {
    const f = parseFilters(sp, categoria);
    if (mode === 'new') f.isNew = true;
    return f;
  }, [sp, categoria, mode]);

  const queryKey = `${categoria}|${toQuery(filters)}`;
  const loading = useSimulatedLoading(queryKey, 380);

  const result = useMemo(() => applyFilters(filters), [filters]);
  const pageData = useMemo(() => paginate(result, filters.page), [result, filters.page]);
  const category = categoria ? getCategory(categoria) : undefined;

  const basePath = mode === 'new' ? '/nuevos' : '/productos';

  const navigate = useCallback(
    (next: CatalogFilters, opts?: { category?: string; keepScroll?: boolean }) => {
      const cat = opts?.category ?? next.category;
      const path = mode === 'new' ? basePath : cat ? `/productos/${cat}` : '/productos';
      const qs = toQuery(next);
      const url = qs ? `${path}?${qs}` : path;
      // Mismo path: actualizamos solo la query con la API nativa (se integra con useSearchParams, sin ida al servidor)
      if (path === pathname) window.history.pushState(null, '', url);
      else router.push(url, { scroll: false });
    },
    [router, pathname, mode, basePath],
  );

  const patch = useCallback(
    (p: Partial<CatalogFilters>) => navigate({ ...filters, ...p, page: p.page ?? 1 }),
    [filters, navigate],
  );

  const changeCategory = (slug: string) => navigate({ ...filters, sub: '', page: 1 }, { category: slug });
  const clearAll = () => navigate({ ...filters, q: filters.q, sub: '', price: '', brands: [], avail: [], disc: 0, page: 1, sort: 'relevance' }, { category: '' });

  const goPage = (page: number) => {
    navigate({ ...filters, page });
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Si cambia la categoría por URL, volvemos arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [categoria]);

  const title = filters.q
    ? `Resultados para «${filters.q}»`
    : mode === 'new'
      ? 'Novedades'
      : category
        ? category.name
        : filters.offers
          ? 'Ofertas'
          : 'Todos los productos';

  const crumbs: Crumb[] = [{ label: 'Productos', href: '/productos' }];
  if (mode === 'new') crumbs.splice(0, 1, { label: 'Novedades' });
  else if (category) crumbs.push({ label: category.name, href: `/productos/${category.slug}` });
  if (filters.sub) crumbs.push({ label: filters.sub });
  if (filters.q) crumbs.push({ label: `Búsqueda: ${filters.q}` });
  if (crumbs.length === 1 && mode === 'catalog') crumbs.splice(0, 1, { label: 'Productos' });

  // chips de filtros activos
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.q) chips.push({ key: 'q', label: `Búsqueda: ${filters.q}`, remove: () => patch({ q: '' }) });
  if (filters.sub) chips.push({ key: 'sub', label: filters.sub, remove: () => patch({ sub: '' }) });
  if (filters.price) chips.push({ key: 'price', label: PRICE_RANGES.find((r) => r.id === filters.price)?.label ?? '', remove: () => patch({ price: '' }) });
  filters.brands.forEach((b) => chips.push({ key: `b-${b}`, label: b, remove: () => patch({ brands: filters.brands.filter((x) => x !== b) }) }));
  filters.avail.forEach((a) => chips.push({ key: `a-${a}`, label: AVAIL_OPTIONS.find((o) => o.id === a)?.label ?? a, remove: () => patch({ avail: filters.avail.filter((x) => x !== a) }) }));
  if (filters.disc) chips.push({ key: 'd', label: `${filters.disc}% o más`, remove: () => patch({ disc: 0 }) });
  if (filters.offers) chips.push({ key: 'o', label: 'Solo ofertas', remove: () => patch({ offers: false }) });

  const activeCount = activeFilterCount(filters);
  const sidebar = <FilterSidebar filters={filters} onChange={patch} onCategory={changeCategory} onClear={clearAll} />;

  return (
    <div className="container-page py-5 md:py-7" ref={topRef}>
      <Breadcrumbs items={crumbs} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight md:text-4xl">{title}</h1>
          {category && !filters.q && <p className="mt-1 text-ink-500">{category.tagline}</p>}
          {mode === 'new' && !filters.q && <p className="mt-1 text-ink-500">Lo último que llegó a nuestro local.</p>}
        </div>
        <p className="text-sm font-semibold text-ink-500" aria-live="polite">
          {loading ? 'Buscando…' : `${result.length} ${result.length === 1 ? 'producto' : 'productos'}`}
        </p>
      </div>

      {/* Subcategorías */}
      {category && (
        <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          <button type="button" onClick={() => patch({ sub: '' })} className={cn('chip shrink-0', !filters.sub && 'chip-active')}>Todo</button>
          {category.subcategories.map((s) => (
            <button key={s} type="button" onClick={() => patch({ sub: s })} className={cn('chip shrink-0', filters.sub === s && 'chip-active')}>{s}</button>
          ))}
        </div>
      )}
      {!category && mode === 'catalog' && !filters.q && (
        <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          {categories.map((c) => (
            <Link key={c.slug} href={`/productos/${c.slug}`} className="chip shrink-0">{c.name}</Link>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="card sticky top-[152px] max-h-[calc(100vh-170px)] overflow-y-auto p-5">{sidebar}</div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setFiltersOpen(true)} className="btn btn-outline lg:hidden">
              <SlidersHorizontal size={18} /> Filtros{activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs text-white">{activeCount}</span>}
            </button>
            <div className="ml-auto"><SortDropdown value={filters.sort} onChange={(v) => patch({ sort: v })} /></div>
          </div>

          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Filtros activos">
              {chips.map((c) => (
                <button key={c.key} type="button" onClick={c.remove} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-50 pl-3 pr-2 text-sm font-bold text-brand-700 hover:bg-brand-100" aria-label={`Quitar filtro ${c.label}`}>
                  {c.label} <X size={14} />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="px-1 text-sm font-bold text-ink-500 hover:text-coral-600">Limpiar todo</button>
            </div>
          )}

          <div className="mt-4">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : result.length === 0 ? (
              <EmptyState icon={PackageSearch} title="No encontramos productos" description="Prueba quitando algunos filtros o buscando con otras palabras.">
                <button type="button" onClick={clearAll} className="btn btn-primary">Limpiar filtros</button>
                <Link href="/ofertas" className="btn btn-outline">Ver ofertas</Link>
              </EmptyState>
            ) : (
              <>
                <ProductGrid products={pageData.items} variant="catalog" />
                <Pagination page={pageData.page} pages={pageData.pages} onChange={goPage} />
                <p className="mt-3 text-center text-sm text-ink-500">
                  Mostrando {(pageData.page - 1) * 12 + 1}–{Math.min(pageData.page * 12, pageData.total)} de {pageData.total}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros"
        side="left"
        footer={
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={clearAll} className="btn btn-outline">Limpiar</button>
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary">Ver {result.length} productos</button>
          </div>
        }
      >
        <div className="p-5">{sidebar}</div>
      </Drawer>
    </div>
  );
}
