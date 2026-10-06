'use client';

import Image from 'next/image';
import { CheckCircle2, Clock, IdCard, MapPin, Navigation, Phone } from 'lucide-react';
import { store, storeStatus } from '@/data/stores';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/format';
import { MAPS_URL } from '@/lib/constants';
import Breadcrumbs from './Breadcrumbs';
import StoreMap from './StoreMap';


export default function StoresView() {
  const mounted = useMounted();
  const status = mounted ? storeStatus(store, new Date()) : null;

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Dónde encontrarnos' }]} />

      <div className="mt-5 grid items-start gap-8 lg:grid-cols-2">
        <div>
          {status && (
            <span className={cn('badge px-2.5 py-1 text-[13px]', status.open ? 'bg-mint-50 text-mint-700' : 'bg-ink-100 text-ink-500')}>
              <span className={cn('h-1.5 w-1.5 rounded-full', status.open ? 'bg-mint-500' : 'bg-ink-300')} /> {status.label}
            </span>
          )}
          <h1 className="mt-3 text-[30px] font-extrabold leading-tight md:text-5xl">Dónde encontrarnos</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-600">{store.description}</p>

          <dl className="card mt-6 divide-y divide-ink-100 text-[15px]">
            <div className="flex items-start gap-3 p-4"><MapPin size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Dirección</dt><dd className="text-ink-600">{store.address}</dd></div></div>
            <div className="flex items-start gap-3 p-4"><Clock size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Horario</dt><dd className="text-ink-600">{store.hoursLabel}</dd></div></div>
            <div className="flex items-start gap-3 p-4"><Phone size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Teléfono</dt><dd className="text-ink-600">{store.phone}</dd></div></div>
          </dl>

          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg mt-5">
            <Navigation size={19} /> Cómo llegar
          </a>

          <h2 className="mt-8 text-lg font-extrabold">Servicios</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {store.services.map((s) => (
              <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-200"><CheckCircle2 size={14} className="text-mint-600" /> {s}</li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3 rounded-2xl border border-sun-300 bg-sun-100/60 p-4 text-sm text-ink-800">
            <IdCard size={22} className="mt-0.5 shrink-0 text-sun-600" />
            <p><strong>Solo retiro en tienda.</strong> No tenemos reparto a domicilio. Para retirar tu pedido debes ser mayor de 18 años y presentar tu cédula de identidad vigente.</p>
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-[152px]">
          <figure className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
            <Image src="/local.jpg" alt="Fachada de Botillería Oasis en Avenida Prat 813, Quirihue" width={640} height={640} className="h-auto w-full object-cover" priority />
            <figcaption className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-700">
              <MapPin size={16} className="shrink-0 text-brand-600" /> {store.address}
            </figcaption>
          </figure>
          <StoreMap />
        </div>
      </div>
    </div>
  );
}
