'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { categories } from '@/data/categories';
import { POPULAR_SEARCHES, normalize, searchProducts } from '@/lib/search';
import { formatCLP } from '@/lib/format';
import ProductImage from './ProductImage';
import CategoryIcon from './CategoryIcon';

interface Props {
  id?: string;
  onNavigate?: () => void;
  className?: string;
}

export default function SearchBar({ id = 'search', onNavigate, className = '' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = value.trim();
  const results = useMemo(() => (q.length >= 2 ? searchProducts(q) : []), [q]);
  const shown = results.slice(0, 6);
  const catMatches = useMemo(
    () => (q.length >= 2 ? categories.filter((c) => normalize(c.name).includes(normalize(q))).slice(0, 2) : []),
    [q],
  );

  useEffect(() => {
    setOpen(false);
    setActive(-1);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
    router.push(`/productos?q=${encodeURIComponent(t)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && active < shown.length) {
      setOpen(false);
      onNavigate?.();
      router.push(`/producto/${shown[active].id}`);
      return;
    }
    go(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!shown.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % shown.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? shown.length - 1 : a - 1));
    }
  };

  const listId = `${id}-listbox`;

  return (
    <form ref={wrapRef} role="search" onSubmit={onSubmit} className={`relative w-full ${className}`}>
      <label htmlFor={id} className="sr-only">Buscar productos</label>
      <div className="relative">
        <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          value={value}
          placeholder="Busca productos, marcas y categorías"
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-12 w-full rounded-full border-2 border-transparent bg-white pl-12 pr-[104px] text-[15px] text-ink-900 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-sun-400 focus:ring-4 focus:ring-sun-300/40 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => {
              setValue('');
              inputRef.current?.focus();
            }}
            className="absolute right-[88px] top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          >
            <X size={16} />
          </button>
        )}
        <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-ink-900 px-4 text-sm font-bold text-white transition hover:bg-brand-700">
          Buscar
        </button>
      </div>

      {open && (
        <div id={listId} role="listbox" className="absolute inset-x-0 top-full z-[60] mt-2 max-h-[70vh] animate-pop-in overflow-y-auto rounded-2xl border border-ink-100 bg-white p-2 text-ink-900 shadow-pop">
          {q.length < 2 ? (
            <div className="p-3">
              <p className="mb-2 text-sm font-bold text-ink-500">Búsquedas populares</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((s) => (
                  <button key={s} type="button" onClick={() => { setValue(s); go(s); }} className="chip">
                    <Search size={14} /> {s}
                  </button>
                ))}
              </div>
              <p className="mb-2 mt-4 text-sm font-bold text-ink-500">Categorías</p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {categories.slice(0, 6).map((c) => (
                  <Link key={c.slug} href={`/productos/${c.slug}`} onClick={() => { setOpen(false); onNavigate?.(); }} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-700">
                    <CategoryIcon name={c.icon} size={16} className="text-ink-400" /> {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : shown.length === 0 ? (
            <div className="p-5 text-center">
              <p className="font-bold">No encontramos resultados para «{q}»</p>
              <p className="mt-1 text-sm text-ink-500">Revisa la ortografía o prueba con una búsqueda más general.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCHES.slice(0, 4).map((s) => (
                  <button key={s} type="button" onClick={() => { setValue(s); go(s); }} className="chip">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {catMatches.map((c) => (
                <Link key={c.slug} href={`/productos/${c.slug}`} onClick={() => { setOpen(false); onNavigate?.(); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-brand-50">
                  <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: c.colors[0], color: c.colors[1] }}>
                    <CategoryIcon name={c.icon} size={16} />
                  </span>
                  Ver todo en {c.name}
                </Link>
              ))}
              {shown.map((p, i) => (
                <Link
                  key={p.id}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={active === i}
                  href={`/producto/${p.id}`}
                  onClick={() => { setOpen(false); onNavigate?.(); }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 ${active === i ? 'bg-brand-50' : 'hover:bg-ink-50'}`}
                >
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-50 ring-1 ring-ink-100">
                    <ProductImage product={p} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{p.name}</span>
                    <span className="block text-xs text-ink-500">{p.brand}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-extrabold">{formatCLP(p.price)}</span>
                    {p.discount > 0 && <span className="block text-xs font-bold text-coral-600">-{p.discount}%</span>}
                  </span>
                </Link>
              ))}
              <button type="button" onClick={() => go(q)} className="mt-1 w-full rounded-xl bg-brand-50 px-3 py-3 text-sm font-bold text-brand-700 hover:bg-brand-100">
                Ver los {results.length} resultados para «{q}»
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}
