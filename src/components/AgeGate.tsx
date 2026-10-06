'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { MIN_AGE } from '@/lib/constants';
import { LogoMark } from './Logo';

/** Pantalla de verificación de edad: bloquea el sitio hasta que el visitante declara ser mayor de edad. */
export default function AgeGate() {
  const { hydrated, ageVerified, dispatch } = useStore();
  const [denied, setDenied] = useState(false);
  const open = hydrated && !ageVerified;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-ink-900/95 p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-md animate-pop-in rounded-3xl bg-white p-7 text-center shadow-pop sm:p-9">
        <div className="mx-auto grid w-fit place-items-center"><LogoMark size={96} /></div>

        {denied ? (
          <>
            <span className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-full bg-coral-50 text-coral-600"><ShieldAlert size={28} /></span>
            <h1 id="age-title" className="mt-4 text-2xl font-extrabold">Lo sentimos</h1>
            <p className="mt-2 text-ink-600">
              La venta de alcohol está prohibida para menores de {MIN_AGE} años. Este sitio solo está disponible para personas mayores de edad.
            </p>
            <button type="button" onClick={() => setDenied(false)} className="btn btn-outline mt-6 w-full">Volver</button>
          </>
        ) : (
          <>
            <h1 id="age-title" className="mt-5 text-[28px] font-extrabold leading-tight">¿Tienes {MIN_AGE} años o más?</h1>
            <p className="mt-2 text-ink-600">
              Vendemos bebidas alcohólicas, por lo que debes ser mayor de edad para entrar. Al retirar tu pedido te pediremos la cédula de identidad.
            </p>
            <div className="mt-6 grid gap-2.5">
              <button type="button" autoFocus onClick={() => dispatch({ type: 'AGE_CONFIRM' })} className="btn btn-primary btn-lg w-full">
                Sí, soy mayor de {MIN_AGE}
              </button>
              <button type="button" onClick={() => setDenied(true)} className="btn btn-outline w-full">
                No, soy menor de edad
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-400">
          El exceso de alcohol es dañino · Prohíbase el expendio de bebidas alcohólicas a menores de 18 años
        </p>
      </div>
    </div>
  );
}
