'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CircleUser, MapPin, Plus, Trash2 } from 'lucide-react';
import { regions } from '@/data/regions';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { cn } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import EmptyState from './EmptyState';
import { SelectField, TextField } from './Field';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Errors = Record<string, string>;

export default function AccountView() {
  const sp = useSearchParams();
  const { user, addresses, hydrated, dispatch } = useStore();
  const { openLogin, toast } = useUI();
  const [tab, setTab] = useState<'perfil' | 'direcciones'>(sp.get('tab') === 'direcciones' ? 'direcciones' : 'perfil');
  const [p, setP] = useState({ name: '', lastName: '', email: '', phone: '' });
  const [pe, setPe] = useState<Errors>({});
  const [adding, setAdding] = useState(false);
  const [a, setA] = useState({ label: '', region: 'Ñuble', comuna: '', street: '', number: '', apartment: '' });
  const [ae, setAe] = useState<Errors>({});

  useEffect(() => {
    setTab(sp.get('tab') === 'direcciones' ? 'direcciones' : 'perfil');
  }, [sp]);

  useEffect(() => {
    if (user) setP({ name: user.name, lastName: user.lastName ?? '', email: user.email, phone: user.phone ?? '' });
  }, [user]);

  if (!hydrated) return <div className="container-page py-10"><div className="skeleton mx-auto h-72 max-w-2xl" /></div>;

  if (!user) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState headingLevel="h1" icon={CircleUser} title="Inicia sesión para ver tu cuenta" description="Administra tus datos, direcciones y puntos del Club MIXMARKET.">
          <button type="button" onClick={() => openLogin('login', '/cuenta')} className="btn btn-primary btn-lg">Iniciar sesión</button>
          <button type="button" onClick={() => openLogin('register', '/cuenta')} className="btn btn-outline btn-lg">Crear cuenta</button>
        </EmptyState>
      </div>
    );
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (p.name.trim().length < 2) er.name = 'Ingresa tu nombre';
    if (!EMAIL_RE.test(p.email.trim())) er.email = 'Ingresa un correo válido';
    if (p.phone && p.phone.replace(/\D/g, '').length < 8) er.phone = 'Ingresa un teléfono válido';
    setPe(er);
    if (Object.keys(er).length) return;
    dispatch({ type: 'UPDATE_USER', user: { name: p.name.trim(), lastName: p.lastName.trim() || undefined, email: p.email.trim(), phone: p.phone.trim() || undefined } });
    toast({ type: 'success', title: 'Perfil actualizado' });
  };

  const comunas = regions.find((r) => r.name === a.region)?.comunas ?? [];

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!a.comuna) er.comuna = 'Selecciona tu comuna';
    if (a.street.trim().length < 3) er.street = 'Ingresa la calle';
    if (!a.number.trim()) er.number = 'Ingresa el número';
    setAe(er);
    if (Object.keys(er).length) return;
    dispatch({ type: 'ADDR_ADD', address: { id: `addr-${Date.now()}`, label: a.label.trim() || `Dirección ${addresses.length + 1}`, region: a.region, comuna: a.comuna, street: a.street.trim(), number: a.number.trim(), apartment: a.apartment.trim() || undefined } });
    setA({ label: '', region: 'Ñuble', comuna: '', street: '', number: '', apartment: '' });
    setAdding(false);
    toast({ type: 'success', title: 'Dirección guardada' });
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Mi cuenta' }]} />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 font-display text-3xl font-extrabold text-white">{user.name.charAt(0).toUpperCase()}</span>
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight md:text-4xl">Hola, {user.name}</h1>
          <p className="text-ink-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav className="card flex gap-1 overflow-x-auto p-2 lg:flex-col" aria-label="Secciones de la cuenta">
          {([['perfil', 'Mi perfil'], ['direcciones', 'Direcciones']] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined} className={cn('h-11 shrink-0 rounded-xl px-4 text-left text-[15px] font-bold transition', tab === id ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50')}>
              {label}
            </button>
          ))}
          <Link href="/mis-pedidos" className="flex h-11 shrink-0 items-center rounded-xl px-4 text-[15px] font-bold text-ink-600 hover:bg-ink-50">Mis pedidos</Link>
          <Link href="/club" className="flex h-11 shrink-0 items-center rounded-xl px-4 text-[15px] font-bold text-ink-600 hover:bg-ink-50">Club MIXMARKET</Link>
        </nav>

        {tab === 'perfil' ? (
          <form onSubmit={saveProfile} noValidate className="card p-5 sm:p-7">
            <h2 className="text-xl font-extrabold">Datos personales</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField id="a-name" label="Nombre" value={p.name} onChange={(v) => setP({ ...p, name: v })} error={pe.name} />
              <TextField id="a-last" label="Apellido" value={p.lastName} onChange={(v) => setP({ ...p, lastName: v })} optional />
              <TextField id="a-email" label="Email" type="email" value={p.email} onChange={(v) => setP({ ...p, email: v })} error={pe.email} />
              <TextField id="a-phone" label="Teléfono" value={p.phone} onChange={(v) => setP({ ...p, phone: v })} error={pe.phone} optional placeholder="+56 9 1234 5678" />
            </div>
            <div className="mt-6"><button type="submit" className="btn btn-primary">Guardar cambios</button></div>
          </form>
        ) : (
          <section className="card p-5 sm:p-7" aria-label="Direcciones">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">Mis direcciones</h2>
              {!adding && <button type="button" onClick={() => setAdding(true)} className="btn btn-primary btn-sm"><Plus size={16} /> Agregar dirección</button>}
            </div>

            {adding && (
              <form onSubmit={saveAddress} noValidate className="mt-5 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField id="ad-label" label="Nombre de la dirección" value={a.label} onChange={(v) => setA({ ...a, label: v })} optional placeholder="Casa, trabajo…" className="sm:col-span-2" />
                  <SelectField id="ad-region" label="Región" value={a.region} onChange={(v) => setA({ ...a, region: v, comuna: '' })} options={regions.map((r) => ({ value: r.name, label: r.name }))} />
                  <SelectField id="ad-comuna" label="Comuna" value={a.comuna} onChange={(v) => setA({ ...a, comuna: v })} options={comunas.map((c) => ({ value: c, label: c }))} placeholder="Selecciona tu comuna" error={ae.comuna} />
                  <TextField id="ad-street" label="Calle" value={a.street} onChange={(v) => setA({ ...a, street: v })} error={ae.street} />
                  <div className="grid grid-cols-2 gap-4">
                    <TextField id="ad-number" label="Número" value={a.number} onChange={(v) => setA({ ...a, number: v })} error={ae.number} inputMode="numeric" />
                    <TextField id="ad-apt" label="Depto." value={a.apartment} onChange={(v) => setA({ ...a, apartment: v })} optional />
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button type="submit" className="btn btn-primary">Guardar dirección</button>
                  <button type="button" onClick={() => { setAdding(false); setAe({}); }} className="btn btn-outline">Cancelar</button>
                </div>
              </form>
            )}

            {addresses.length === 0 && !adding ? (
              <div className="mt-6 rounded-2xl border border-dashed border-ink-200 px-6 py-10 text-center">
                <MapPin size={32} className="mx-auto text-ink-300" />
                <p className="mt-3 font-bold">No tienes direcciones guardadas</p>
                <p className="text-sm text-ink-500">Agrega una para completar tus compras más rápido.</p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {addresses.map((ad) => (
                  <li key={ad.id} className="flex items-start justify-between gap-3 rounded-2xl border border-ink-200 p-4">
                    <div>
                      <p className="font-extrabold">{ad.label}</p>
                      <p className="mt-1 text-[15px] text-ink-600">{ad.street} {ad.number}{ad.apartment ? `, ${ad.apartment}` : ''}</p>
                      <p className="text-[15px] text-ink-500">{ad.comuna}, {ad.region}</p>
                    </div>
                    <button type="button" aria-label={`Eliminar dirección ${ad.label}`} onClick={() => { dispatch({ type: 'ADDR_REMOVE', id: ad.id }); toast({ type: 'info', title: 'Dirección eliminada' }); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-400 hover:bg-coral-50 hover:text-coral-600">
                      <Trash2 size={17} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
