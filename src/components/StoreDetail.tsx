'use client';

import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Navigation, Phone } from 'lucide-react';
import type { Store } from '@/types';
import { products } from '@/data/products';
import { storeStatus } from '@/data/stores';
import { storeAvailability } from '@/lib/availability';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import StoreMap from './StoreMap';
import ProductGrid from './ProductGrid';

export default function StoreDetail({ store }: { store: Store }) {
  const { selectedStoreId, dispatch } = useStore();
  const { toast } = useUI();
  const mounted = useMounted();
  const status = mounted ? storeStatus(store, new Date()) : null;
  const chosen = selectedStoreId === store.id;
  const available = products.filter((p) => storeAvailability(p, store.id) === 'available').sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Tiendas', href: '/tiendas' }, { label: store.name }]} />

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {status && (
              <span className={cn('badge px-2.5 py-1 text-[13px]', status.open ? 'bg-mint-50 text-mint-700' : 'bg-ink-100 text-ink-500')}>
                <span className={cn('h-1.5 w-1.5 rounded-full', status.open ? 'bg-mint-500' : 'bg-ink-300')} /> {status.label}
              </span>
            )}
            {chosen && <span className="badge bg-brand-50 px-2.5 py-1 text-[13px] text-brand-700"><CheckCircle2 size={13} /> Tu tienda</span>}
          </div>
          <h1 className="mt-3 text-[30px] font-extrabold leading-tight md:text-5xl">{store.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-600">{store.description}</p>

          <dl className="card mt-6 divide-y divide-ink-100 text-[15px]">
            <div className="flex items-start gap-3 p-4"><MapPin size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Dirección</dt><dd className="text-ink-600">{store.address}</dd></div></div>
            <div className="flex items-start gap-3 p-4"><Clock size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Horario</dt><dd className="text-ink-600">{store.hoursLabel}</dd></div></div>
            <div className="flex items-start gap-3 p-4"><Phone size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Teléfono</dt><dd className="text-ink-600">{store.phone}</dd></div></div>
            <div className="flex items-start gap-3 p-4"><Navigation size={19} className="mt-0.5 shrink-0 text-brand-600" /><div><dt className="font-bold">Distancia</dt><dd className="text-ink-600">A {store.distanceKm.toLocaleString('es-CL')} km de ti (ficticio)</dd></div></div>
          </dl>

          <h2 className="mt-6 text-lg font-extrabold">Servicios</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {store.services.map((s) => (
              <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-200"><CheckCircle2 size={14} className="text-mint-600" /> {s}</li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={chosen}
              onClick={() => {
                dispatch({ type: 'SET_STORE', storeId: store.id });
                dispatch({ type: 'SET_MODE', mode: 'pickup' });
                toast({ type: 'success', title: 'Retirarás tus compras aquí', description: store.name, action: { label: 'Ir al carrito', href: '/carrito' } });
              }}
              className="btn btn-primary btn-lg"
            >
              {chosen ? 'Es tu tienda de retiro' : 'Retirar mis compras aquí'}
            </button>
            <Link href="/tiendas" className="btn btn-outline btn-lg">Ver todas las tiendas</Link>
          </div>
        </div>

        <StoreMap activeId={store.id} className="lg:sticky lg:top-[152px]" />
      </div>

      <section className="mt-12" aria-labelledby="disponibles">
        <h2 id="disponibles" className="text-2xl font-extrabold md:text-[30px]">Disponibles hoy en esta tienda</h2>
        <p className="mt-1 text-ink-500">Productos con stock para retiro en {store.shortName}.</p>
        <div className="mt-5"><ProductGrid products={available} /></div>
      </section>
    </div>
  );
}
