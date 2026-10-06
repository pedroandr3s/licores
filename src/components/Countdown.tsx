'use client';

import { useEffect, useState } from 'react';

const KEY = 'mixmarket:flash-end';
const DEFAULT_MS = (5 * 3600 + 32 * 60 + 18) * 1000;

function readEnd() {
  try {
    const n = Number(window.localStorage.getItem(KEY));
    if (n > Date.now()) return n;
    const end = Date.now() + DEFAULT_MS;
    window.localStorage.setItem(KEY, String(end));
    return end;
  } catch {
    return Date.now() + DEFAULT_MS;
  }
}

/** Milisegundos que quedan de la oferta flash (null hasta montar). Se reinicia al terminar. */
export function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    let end = readEnd();
    const tick = () => {
      let l = end - Date.now();
      if (l <= 0) {
        end = Date.now() + DEFAULT_MS;
        try {
          window.localStorage.setItem(KEY, String(end));
        } catch {
          /* noop */
        }
        l = DEFAULT_MS;
      }
      setLeft(l);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return left;
}

export function splitTime(ms: number | null) {
  if (ms === null) return { h: '--', m: '--', s: '--' };
  const total = Math.floor(ms / 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return { h: p(Math.floor(total / 3600)), m: p(Math.floor((total % 3600) / 60)), s: p(total % 60) };
}

export default function Countdown({ variant = 'boxes' }: { variant?: 'boxes' | 'inline' | 'light' }) {
  const left = useCountdown();
  const t = splitTime(left);

  if (variant === 'inline') {
    return (
      <span className="font-bold tabular-nums" aria-label={`Oferta termina en ${t.h} horas ${t.m} minutos ${t.s} segundos`}>
        {t.h}:{t.m}:{t.s}
      </span>
    );
  }

  const box = variant === 'light' ? 'bg-white text-ink-900' : 'bg-ink-900 text-white';
  const Part = ({ v, l }: { v: string; l: string }) => (
    <span className="flex flex-col items-center">
      <span className={`grid h-12 w-12 place-items-center rounded-xl font-display text-2xl font-extrabold tabular-nums sm:h-14 sm:w-14 sm:text-3xl ${box}`}>{v}</span>
      <span className="mt-1 text-[11px] font-semibold opacity-80">{l}</span>
    </span>
  );
  return (
    <div className="inline-flex items-start gap-1.5" role="timer" aria-label={`Oferta termina en ${t.h} horas ${t.m} minutos ${t.s} segundos`}>
      <Part v={t.h} l="horas" />
      <span className="pt-2.5 font-display text-2xl font-extrabold sm:pt-3">:</span>
      <Part v={t.m} l="min" />
      <span className="pt-2.5 font-display text-2xl font-extrabold sm:pt-3">:</span>
      <Part v={t.s} l="seg" />
    </div>
  );
}
