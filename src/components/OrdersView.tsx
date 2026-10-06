'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useSimulatedLoading } from '@/hooks/useMounted';
import { isActiveOrder } from '@/lib/orders';
import { cn } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import OrderCard from './OrderCard';
import EmptyState from './EmptyState';
import { BlockSkeleton } from './Skeletons';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'En curso' },
  { id: 'done', label: 'Entregados' },
] as const;

export default function OrdersView() {
  const { orders, hydrated } = useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const loading = useSimulatedLoading(filter, 350) || !hydrated;

  const list = useMemo(
    () =>
      orders
        .filter((o) => (filter === 'all' ? true : filter === 'active' ? isActiveOrder(o) : !isActiveOrder(o)))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders, filter],
  );

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Mis pedidos' }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold md:text-4xl">Mis pedidos</h1>
          <p className="mt-1 text-ink-500">Revisa el estado de tus compras y vuelve a comprar lo que más usas.</p>
        </div>
        <Link href="/productos" className="btn btn-primary">Seguir comprando</Link>
      </div>

      <div className="mt-5 flex gap-2" role="tablist" aria-label="Filtrar pedidos">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)} className={cn('chip', filter === f.id && 'chip-active')}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <>
            <BlockSkeleton className="h-44" />
            <BlockSkeleton className="h-44" />
          </>
        ) : list.length === 0 ? (
          <EmptyState icon={Package} title={filter === 'all' ? 'Aún no tienes pedidos' : 'No hay pedidos en esta categoría'} description="Cuando compres algo, lo verás aquí con su estado de entrega.">
            <Link href="/productos" className="btn btn-primary">Ir a comprar</Link>
            {filter !== 'all' && <button type="button" onClick={() => setFilter('all')} className="btn btn-outline">Ver todos</button>}
          </EmptyState>
        ) : (
          list.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
