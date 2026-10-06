'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleUser } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import Breadcrumbs from './Breadcrumbs';
import EmptyState from './EmptyState';
import { TextField } from './Field';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Errors = Record<string, string>;

export default function AccountView() {
  const { user, hydrated, dispatch } = useStore();
  const { openLogin, toast } = useUI();
  const [p, setP] = useState({ name: '', lastName: '', email: '', phone: '' });
  const [pe, setPe] = useState<Errors>({});

  useEffect(() => {
    if (user) setP({ name: user.name, lastName: user.lastName ?? '', email: user.email, phone: user.phone ?? '' });
  }, [user]);

  if (!hydrated) return <div className="container-page py-10"><div className="skeleton mx-auto h-72 max-w-2xl" /></div>;

  if (!user) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState headingLevel="h1" icon={CircleUser} title="Inicia sesión para ver tu cuenta" description="Administra tus datos y los puntos del Club Oasis.">
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
          <span aria-current="page" className="flex h-11 shrink-0 items-center rounded-xl bg-brand-50 px-4 text-[15px] font-bold text-brand-700">Mi perfil</span>
          <Link href="/mis-pedidos" className="flex h-11 shrink-0 items-center rounded-xl px-4 text-[15px] font-bold text-ink-600 hover:bg-ink-50">Mis pedidos</Link>
          <Link href="/club" className="flex h-11 shrink-0 items-center rounded-xl px-4 text-[15px] font-bold text-ink-600 hover:bg-ink-50">Club Oasis</Link>
        </nav>

        <form onSubmit={saveProfile} noValidate className="card p-5 sm:p-7">
          <h2 className="text-xl font-extrabold">Datos personales</h2>
          <p className="mt-1 text-sm text-ink-500">No guardamos direcciones: todas las compras se retiran en el local.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField id="a-name" label="Nombre" value={p.name} onChange={(v) => setP({ ...p, name: v })} error={pe.name} />
            <TextField id="a-last" label="Apellido" value={p.lastName} onChange={(v) => setP({ ...p, lastName: v })} optional />
            <TextField id="a-email" label="Email" type="email" value={p.email} onChange={(v) => setP({ ...p, email: v })} error={pe.email} />
            <TextField id="a-phone" label="Teléfono" value={p.phone} onChange={(v) => setP({ ...p, phone: v })} error={pe.phone} optional placeholder="+56 9 1234 5678" />
          </div>
          <div className="mt-6"><button type="submit" className="btn btn-primary">Guardar cambios</button></div>
        </form>
      </div>
    </div>
  );
}
