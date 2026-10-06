'use client';

import { useState } from 'react';
import { Coins, Crown, Gift, ShoppingBag } from 'lucide-react';
import type { Reward } from '@/types';
import { rewards } from '@/data/rewards';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { formatNumber, cn } from '@/lib/format';
import { formatDateOnly } from '@/lib/dates';
import Breadcrumbs from './Breadcrumbs';
import ProductImage from './ProductImage';
import Modal from './ui/Modal';

const steps = [
  { icon: ShoppingBag, title: 'Compra', text: 'Compra online o en cualquier tienda MIXMARKET.' },
  { icon: Coins, title: 'Acumula', text: 'Sumas 1 punto por cada $100 de compra.' },
  { icon: Gift, title: 'Canjea', text: 'Usa tus puntos en vales, despachos gratis y productos.' },
];

export default function ClubView() {
  const { user, points, redemptions, dispatch } = useStore();
  const { openLogin, toast } = useUI();
  const [confirm, setConfirm] = useState<Reward | null>(null);

  const nextReward = rewards.filter((r) => r.points > points).sort((a, b) => a.points - b.points)[0];
  const progress = nextReward ? Math.min(100, Math.round((points / nextReward.points) * 100)) : 100;

  const redeem = (r: Reward) => {
    dispatch({ type: 'REDEEM', redemption: { id: `rd-${Date.now()}`, rewardId: r.id, title: r.title, points: r.points, date: new Date().toISOString() } });
    setConfirm(null);
    toast({ type: 'success', title: '¡Canje realizado!', description: `${r.title} · −${formatNumber(r.points)} puntos` });
  };

  const request = (r: Reward) => {
    if (!user) {
      openLogin('login');
      toast({ type: 'info', title: 'Inicia sesión para canjear tus puntos' });
      return;
    }
    setConfirm(r);
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Club MIXMARKET' }]} />

      <section className="mt-5 grid overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 text-white lg:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-10 lg:p-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-bold text-sun-300"><Crown size={16} /> Club MIXMARKET</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">Acumula puntos en tus compras.</h1>
          <p className="mt-4 max-w-lg text-lg text-ink-200">Cada compra te acerca a un vale, un despacho gratis o un producto exclusivo. Es gratis y no vence tan rápido como crees.</p>
          {!user && (
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => openLogin('register')} className="btn btn-sun btn-lg">Unirme al Club</button>
              <button type="button" onClick={() => openLogin('login')} className="btn btn-lg bg-white/10 text-white hover:bg-white/20">Ya tengo cuenta</button>
            </div>
          )}
        </div>

        <div className="relative grid place-items-center p-6 sm:p-10">
          <span aria-hidden className="absolute right-[-60px] top-[-60px] h-60 w-60 rounded-full bg-sun-400/90" />
          <div className="relative w-full max-w-sm rotate-[-3deg] rounded-3xl bg-white p-6 text-ink-900 shadow-pop">
            {user ? (
              <>
                <p className="text-sm font-semibold text-ink-500">Hola, {user.name}</p>
                <p className="mt-1 text-sm font-bold text-ink-600">Saldo</p>
                <p className="font-display text-5xl font-extrabold leading-none tracking-tight">{formatNumber(points)} <span className="text-2xl">puntos</span></p>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-brand-600 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-sm text-ink-600">
                  {nextReward ? <>Te faltan <strong>{formatNumber(nextReward.points - points)}</strong> puntos para «{nextReward.title}».</> : 'Ya puedes canjear cualquier premio.'}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-ink-600">Tu saldo</p>
                <p className="font-display text-5xl font-extrabold leading-none text-ink-300">— — —</p>
                <p className="mt-4 text-sm text-ink-600">Inicia sesión para ver tus puntos y canjearlos.</p>
                <button type="button" onClick={() => openLogin('login')} className="btn btn-primary mt-4 w-full">Iniciar sesión</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="text-2xl font-extrabold md:text-[30px]">Así funciona</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="card flex gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600"><s.icon size={24} /></span>
              <div>
                <h3 className="text-lg font-extrabold">{i + 1}. {s.title}</h3>
                <p className="mt-1 text-ink-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="canjea">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="canjea" className="text-2xl font-extrabold md:text-[30px]">Canjea tus puntos</h2>
          {user && <p className="font-bold text-ink-600">Disponibles: <span className="text-brand-700">{formatNumber(points)} pts</span></p>}
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r) => {
            const can = user ? points >= r.points : true;
            const missing = r.points - points;
            return (
              <li key={r.id} className="card flex flex-col overflow-hidden">
                <div className="aspect-[16/10] bg-ink-50">
                  <ProductImage product={{ id: r.id, name: r.title, brand: 'MIXMARKET', shape: r.shape, colors: r.colors }} className="h-full w-full" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-extrabold leading-snug">{r.title}</h3>
                  <p className="mt-1 flex-1 text-[15px] text-ink-600">{r.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-display text-2xl font-extrabold text-brand-700">{formatNumber(r.points)} <span className="text-sm font-bold text-ink-500">pts</span></p>
                    <button type="button" onClick={() => request(r)} disabled={!can} className={cn('btn', can ? 'btn-primary' : 'btn-outline')}>
                      {can ? 'Canjear' : `Faltan ${formatNumber(missing)}`}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {user && redemptions.length > 0 && (
        <section className="mt-12" aria-labelledby="historial">
          <h2 id="historial" className="text-2xl font-extrabold md:text-[30px]">Tus canjes</h2>
          <ul className="card mt-5 divide-y divide-ink-100">
            {redemptions.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
                <div>
                  <p className="font-bold">{r.title}</p>
                  <p className="text-sm text-ink-500">{formatDateOnly(r.date)}</p>
                </div>
                <p className="font-bold text-coral-600">−{formatNumber(r.points)} pts</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-center text-sm text-ink-500">Demostración: el sistema de puntos es simulado y no tiene valor monetario real.</p>

      <Modal open={Boolean(confirm)} onClose={() => setConfirm(null)} title="Confirmar canje" size="sm">
        {confirm && (
          <div className="p-5 sm:p-6">
            <p className="text-ink-700">Vas a canjear <strong>{confirm.title}</strong> por <strong>{formatNumber(confirm.points)} puntos</strong>.</p>
            <p className="mt-2 text-sm text-ink-500">Te quedarán {formatNumber(points - confirm.points)} puntos.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirm(null)} className="btn btn-outline">Cancelar</button>
              <button type="button" data-autofocus onClick={() => redeem(confirm)} className="btn btn-primary">Canjear ahora</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
