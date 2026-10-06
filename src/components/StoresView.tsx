'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { stores, storeStatus } from '@/data/stores';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import StoreMap from './StoreMap';

export default function StoresView() {
  const { selectedStoreId, dispatch } = useStore();
  const { toast } = useUI();
  const mounted = useMounted();
  const now = mounted ? new Date() : null;
  const [focus, setFocus] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const select = (id: string) => {
    setFocus(id);
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Tiendas' }]} />
      <h1 className="mt-4 text-[28px] font-extrabold md:text-4xl">Nuestras tiendas</h1>
      <p className="mt-1 max-w-2xl text-ink-500">Cinco tiendas en Ñuble donde puedes retirar tus compras online gratis, hacer cambios y descubrir ofertas exclusivas.</p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
        <ul className="grid gap-4 lg:order-1">
          {stores.map((s) => {
            const status = now ? storeStatus(s, now) : null;
            const chosen = selectedStoreId === s.id;
            return (
              <li key={s.id} ref={(el) => { refs.current[s.id] = el; }}>
                <article className={cn('card p-5 transition sm:p-6', focus === s.id && 'ring-2 ring-brand-500')}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold">{s.name}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-ink-600"><MapPin size={16} className="shrink-0 text-ink-400" /> {s.address}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {status && (
                        <span className={cn('badge px-2.5 py-1 text-[13px]', status.open ? 'bg-mint-50 text-mint-700' : 'bg-ink-100 text-ink-500')}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', status.open ? 'bg-mint-500' : 'bg-ink-300')} /> {status.label}
                        </span>
                      )}
                      {chosen && <span className="badge bg-brand-50 px-2.5 py-1 text-[13px] text-brand-700"><CheckCircle2 size={13} /> Tu tienda</span>}
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-2 text-[15px] sm:grid-cols-2">
                    <div className="flex items-center gap-2"><Clock size={16} className="shrink-0 text-ink-400" /><dd>{s.hoursLabel}</dd></div>
                    <div className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-ink-400" /><dd>{s.phone}</dd></div>
                    <div className="flex items-center gap-2"><Navigation size={16} className="shrink-0 text-ink-400" /><dd>A {s.distanceKm.toLocaleString('es-CL')} km de ti</dd></div>
                  </dl>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.services.map((sv) => (
                      <li key={sv} className="rounded-full bg-ink-50 px-3 py-1 text-[13px] font-semibold text-ink-600 ring-1 ring-ink-100">{sv}</li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link href={`/tiendas/${s.id}`} className="btn btn-primary">Ver tienda</Link>
                    <button
                      type="button"
                      disabled={chosen}
                      onClick={() => {
                        dispatch({ type: 'SET_STORE', storeId: s.id });
                        toast({ type: 'success', title: 'Tienda seleccionada', description: s.name });
                      }}
                      className="btn btn-outline"
                    >
                      {chosen ? 'Es tu tienda' : 'Elegir como mi tienda'}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="lg:sticky lg:top-[152px]">
          <StoreMap activeId={focus ?? selectedStoreId} onSelect={select} />
        </div>
      </div>
    </div>
  );
}
