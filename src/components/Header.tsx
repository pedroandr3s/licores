'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown, CircleUser, Flame, Heart, HelpCircle, LogOut, MapPin, Menu, Package, ShoppingBag, ShieldCheck, Tag, User, ChevronRight,
} from 'lucide-react';
import { categories } from '@/data/categories';
import { store } from '@/data/stores';
import { useStore, useCartTotals } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { formatCLP } from '@/lib/format';
import Logo from './Logo';
import SearchBar from './SearchBar';
import CategoryIcon from './CategoryIcon';
import Drawer from './ui/Drawer';

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[11px] font-extrabold text-white ring-2 ring-brand-600">
      {n > 99 ? '99+' : n}
    </span>
  );
}

export function PromoBar() {
  return (
    <div className="bg-ink-900 text-[13px] text-white">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <p className="truncate font-medium">
          <span className="font-bold text-sun-300">Solo retiro en tienda</span> · Listo en 1 hora<span className="hidden sm:inline"> · Venta solo a mayores de 18 años</span>
        </p>
        <nav className="hidden items-center gap-5 font-semibold md:flex" aria-label="Enlaces rápidos">
          <Link href="/donde-encontrarnos" className="hover:text-sun-300">Dónde encontrarnos</Link>
          <Link href="/mis-pedidos" className="hover:text-sun-300">Seguir mi pedido</Link>
          <Link href="/ayuda" className="hover:text-sun-300">Ayuda</Link>
          <Link href="/admin" className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 hover:bg-white/20 hover:text-sun-300"><ShieldCheck size={13} /> Admin</Link>
        </nav>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, favorites, dispatch } = useStore();
  const { openCart, openLogin, menuOpen, setMenuOpen, toast } = useUI();
  const totals = useCartTotals();
  const [megaOpen, setMegaOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMegaOpen(false);
    setUserOpen(false);
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setUserOpen(false);
    setMenuOpen(false);
    toast({ type: 'info', title: 'Cerraste sesión' });
  };

  const navLink = (href: string, label: string, extra?: React.ReactNode) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`inline-flex h-11 items-center gap-1.5 px-3.5 text-[15px] font-bold transition-colors ${active ? 'text-brand-700' : 'text-ink-800 hover:text-brand-700'}`}
        aria-current={active ? 'page' : undefined}
      >
        {extra}
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-brand-600 text-white">
        <div className="container-page">
          {/* Fila 1 */}
          <div className="flex h-[68px] items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="-ml-2 grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="shrink-0"><Logo tone="light" /></div>

            <Link
              href="/donde-encontrarnos"
              className="hidden shrink-0 items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left hover:bg-white/10 xl:flex"
              aria-label="Ver nuestro local"
            >
              <MapPin size={22} className="text-sun-300" />
              <span className="leading-tight">
                <span className="block text-xs text-brand-100">Retira en</span>
                <span className="block text-sm font-bold">{store.shortName}</span>
              </span>
            </Link>

            <div className="hidden min-w-0 flex-1 lg:block"><SearchBar id="search-desktop" /></div>

            <div className="ml-auto flex items-center gap-1 lg:ml-0">
              {/* Usuario (desktop) */}
              <div ref={userRef} className="relative hidden lg:block">
                {user ? (
                  <button
                    type="button"
                    onClick={() => setUserOpen((o) => !o)}
                    aria-expanded={userOpen}
                    aria-haspopup="menu"
                    className="flex h-11 items-center gap-2.5 rounded-xl px-2.5 hover:bg-white/10"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-sun-400 text-sm font-extrabold text-ink-900">{user.name.charAt(0).toUpperCase()}</span>
                    <span className="text-left leading-tight">
                      <span className="block text-xs text-brand-100">Hola,</span>
                      <span className="flex items-center gap-1 text-sm font-bold">{user.name} <ChevronDown size={14} /></span>
                    </span>
                  </button>
                ) : (
                  <button type="button" onClick={() => openLogin('login')} className="flex h-11 items-center gap-2.5 rounded-xl px-2.5 hover:bg-white/10">
                    <User size={22} />
                    <span className="text-sm font-bold">Iniciar sesión</span>
                  </button>
                )}
                {userOpen && user && (
                  <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-60 animate-pop-in overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 text-ink-900 shadow-pop">
                    <div className="border-b border-ink-100 px-3 py-2.5">
                      <p className="font-extrabold">{user.name}</p>
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                    </div>
                    {[
                      { href: '/cuenta', label: 'Mi cuenta', icon: CircleUser },
                      { href: '/mis-pedidos', label: 'Mis pedidos', icon: Package },
                      { href: '/favoritos', label: 'Favoritos', icon: Heart },
                    ].map((i) => (
                      <Link key={i.href} href={i.href} role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-brand-50 hover:text-brand-700">
                        <i.icon size={18} className="text-ink-400" /> {i.label}
                      </Link>
                    ))}
                    <button type="button" role="menuitem" onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-ink-100 px-3 py-2.5 text-sm font-semibold text-coral-600 hover:bg-coral-50">
                      <LogOut size={18} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>

              <Link href="/favoritos" aria-label={`Favoritos (${favorites.length})`} className="relative grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10">
                <Heart size={24} />
                <Badge n={favorites.length} />
              </Link>
              <button type="button" onClick={openCart} aria-label={`Abrir carrito (${totals.count} productos)`} className="relative flex h-11 items-center gap-2 rounded-xl px-2.5 hover:bg-white/10">
                <span className="relative">
                  <ShoppingBag size={24} />
                  <Badge n={totals.count} />
                </span>
                <span className="hidden text-left leading-tight xl:block">
                  <span className="block text-xs text-brand-100">Carrito</span>
                  <span className="block text-sm font-bold">{formatCLP(totals.itemsTotal)}</span>
                </span>
              </button>
            </div>
          </div>
          {/* Fila 2 (móvil): buscador */}
          <div className="pb-3 lg:hidden"><SearchBar id="search-mobile" /></div>
        </div>
      </div>

      {/* Navegación secundaria (desktop) */}
      <nav className="relative hidden border-b border-ink-100 bg-white lg:block" aria-label="Categorías y secciones" onMouseLeave={() => setMegaOpen(false)}>
        <div className="container-page flex items-center">
          <div onMouseEnter={() => setMegaOpen(true)}>
            <button
              type="button"
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              className={`inline-flex h-11 items-center gap-2 pr-4 text-[15px] font-extrabold transition-colors ${megaOpen ? 'text-brand-700' : 'text-ink-900 hover:text-brand-700'}`}
            >
              <Menu size={18} /> Productos <ChevronDown size={15} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {navLink('/ofertas', 'Ofertas', <Flame size={17} className="text-coral-500" />)}
          {navLink('/donde-encontrarnos', 'Dónde encontrarnos', <MapPin size={17} className="text-ink-400" />)}
          {navLink('/ayuda', 'Ayuda')}
          <div className="ml-auto flex items-center">
            {navLink('/mis-pedidos', 'Mis pedidos', <Package size={17} className="text-ink-400" />)}
            {navLink('/admin', 'Admin', <ShieldCheck size={17} className="text-brand-600" />)}
          </div>
        </div>

        {megaOpen && (
          <div id="mega-menu" className="absolute inset-x-0 top-full z-50 animate-pop-in border-b border-ink-100 bg-white shadow-pop" onMouseEnter={() => setMegaOpen(true)}>
            <div className="container-page grid grid-cols-[1fr_260px] gap-8 py-7">
              <div className="grid grid-cols-5 gap-x-6 gap-y-7">
                {categories.map((c) => (
                  <div key={c.slug}>
                    <Link href={`/productos/${c.slug}`} className="flex items-center gap-2 font-display text-[15px] font-extrabold text-ink-900 hover:text-brand-700">
                      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: c.colors[0], color: c.colors[1] }}><CategoryIcon name={c.icon} size={15} /></span>
                      {c.name}
                    </Link>
                    <ul className="mt-2 space-y-1">
                      {c.subcategories.slice(0, 4).map((s) => (
                        <li key={s}>
                          <Link href={`/productos/${c.slug}?sub=${encodeURIComponent(s)}`} className="text-sm text-ink-600 hover:text-brand-700 hover:underline">
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link href="/ofertas" className="relative flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 p-5 text-white">
                <span className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-sun-400/90" aria-hidden />
                <span className="absolute right-3 top-3 font-display text-4xl font-extrabold text-ink-900">Ofertas</span>
                <span className="font-display text-xl font-extrabold leading-tight">Ofertas de la semana</span>
                <span className="mt-1 text-sm text-brand-100">Packs y botellas con descuento por tiempo limitado.</span>
                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-brand-700">Ver ofertas <ChevronRight size={14} /></span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Menú móvil */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menú" side="left">
        <div className="pb-8">
          <div className="border-b border-ink-100 bg-brand-50 p-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-lg font-extrabold text-white">{user.name.charAt(0).toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="font-extrabold">Hola, {user.name}</p>
                  <Link href="/cuenta" className="text-sm font-semibold text-brand-700">Mi cuenta</Link>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button type="button" className="btn btn-primary flex-1" onClick={() => { setMenuOpen(false); openLogin('login'); }}>Iniciar sesión</button>
                <button type="button" className="btn btn-outline flex-1" onClick={() => { setMenuOpen(false); openLogin('register'); }}>Crear cuenta</button>
              </div>
            )}
            <Link href="/donde-encontrarnos" className="mt-3 flex w-full items-center gap-2.5 rounded-xl bg-white p-3 text-left ring-1 ring-ink-100">
              <MapPin size={20} className="text-brand-600" />
              <span className="flex-1 leading-tight">
                <span className="block text-xs text-ink-500">Solo retiro en tienda</span>
                <span className="text-sm font-bold">{store.name}</span>
              </span>
              <ChevronRight size={16} className="text-ink-400" />
            </Link>
          </div>

          <div className="px-2 pt-2">
            {[
              { href: '/ofertas', label: 'Ofertas', icon: Flame, cls: 'text-coral-500' },
              { href: '/productos', label: 'Todos los productos', icon: Tag, cls: 'text-ink-500' },
              { href: '/donde-encontrarnos', label: 'Dónde encontrarnos', icon: MapPin, cls: 'text-brand-600' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl px-3 py-3 font-bold hover:bg-ink-50">
                <l.icon size={20} className={l.cls} /> {l.label}
              </Link>
            ))}
          </div>

          <p className="px-5 pb-1 pt-4 text-sm font-bold text-ink-500">Categorías</p>
          <div className="px-2">
            {categories.map((c) => {
              const open = openCat === c.slug;
              return (
                <div key={c.slug}>
                  <button type="button" onClick={() => setOpenCat(open ? null : c.slug)} aria-expanded={open} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold hover:bg-ink-50">
                    <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: c.colors[0], color: c.colors[1] }}><CategoryIcon name={c.icon} size={17} /></span>
                    <span className="flex-1">{c.name}</span>
                    <ChevronDown size={18} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <ul className="mb-1 ml-14 space-y-0.5 border-l border-ink-100 pl-3">
                      <li><Link href={`/productos/${c.slug}`} className="block rounded-lg px-2 py-2 text-sm font-bold text-brand-700">Ver todo en {c.name}</Link></li>
                      {c.subcategories.map((s) => (
                        <li key={s}><Link href={`/productos/${c.slug}?sub=${encodeURIComponent(s)}`} className="block rounded-lg px-2 py-2 text-sm text-ink-700 hover:bg-ink-50">{s}</Link></li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 border-t border-ink-100 px-2 pt-3">
            {[
              { href: '/mis-pedidos', label: 'Mis pedidos', icon: Package },
              { href: '/favoritos', label: 'Favoritos', icon: Heart },
              { href: '/ayuda', label: 'Ayuda', icon: HelpCircle },
              { href: '/admin', label: 'Admin', icon: ShieldCheck },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-ink-700 hover:bg-ink-50">
                <l.icon size={20} className="text-ink-400" /> {l.label}
              </Link>
            ))}
            {user && (
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 font-semibold text-coral-600 hover:bg-coral-50">
                <LogOut size={20} /> Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
}
