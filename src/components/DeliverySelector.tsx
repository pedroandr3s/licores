'use client';

import { Check, Home, Store as StoreIcon } from 'lucide-react';
import type { DeliveryMode, Product } from '@/types';
import { availabilityLabel, availabilityStyle, deliveryAvailability, storeAvailability } from '@/lib/availability';
import { stores } from '@/data/stores';
import { estimatedRange } from '@/lib/dates';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import { formatCLP } from '@/lib/format';
import StoreSelector from './StoreSelector';
import type { ReactNode } from 'react';

interface Props {
  mode: DeliveryMode;
  onModeChange: (m: DeliveryMode) => void;
  storeId: string | null;
  onStoreChange: (id: string) => void;
  /** Ficha de producto: muestra disponibilidad real del producto */
  product?: Product;
  /** Checkout: productos del carrito para calcular disponibilidad por tienda */
  cartProducts?: Product[];
  /** Checkout: deshabilita modalidades que no aplican al carrito */
  disabledModes?: Partial<Record<DeliveryMode, string>>;
  /** Contenido extra debajo de cada modalidad cuando está seleccionada (checkout) */
  deliveryExtra?: ReactNode;
  pickupExtra?: ReactNode;
  hideStoreList?: boolean;
}

function Option({
  selected,
  disabled,
  onSelect,
  icon,
  title,
  subtitle,
  badge,
  children,
  name,
  value,
}: {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
  badge?: ReactNode;
  children?: ReactNode;
  name: string;
  value: string;
}) {
  return (
    <div className={cn('rounded-2xl border bg-white transition', selected ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-ink-200 hover:border-brand-300', disabled && 'opacity-60 hover:border-ink-200')}>
      <label className={cn('flex gap-3.5 p-4', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
        <input type="radio" name={name} value={value} checked={selected} disabled={disabled} onChange={onSelect} className="sr-only" />
        <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', selected ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600')}>{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-base font-extrabold text-ink-900">{title}</span>
            {badge}
          </span>
          <span className="mt-0.5 block text-sm text-ink-600">{subtitle}</span>
        </span>
        <span aria-hidden className={cn('mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300')}>
          {selected && <Check size={12} strokeWidth={3.5} />}
        </span>
      </label>
      {selected && children && <div className="border-t border-ink-100 p-4">{children}</div>}
    </div>
  );
}

export default function DeliverySelector({ mode, onModeChange, storeId, onStoreChange, product, cartProducts, disabledModes, deliveryExtra, pickupExtra, hideStoreList }: Props) {
  const mounted = useMounted();
  const dAvail = product ? deliveryAvailability(product) : null;
  const pickupStates = product ? stores.map((s) => storeAvailability(product, s.id)) : [];
  const pickupOk = product ? pickupStates.some((a) => a !== 'none') : true;
  const uid = product ? `pdp-${product.id}` : 'checkout';

  return (
    <div className="grid gap-3">
      <Option
        name={`delivery-${uid}`}
        value="delivery"
        selected={mode === 'delivery'}
        disabled={Boolean(disabledModes?.delivery) || (product ? dAvail === 'none' : false)}
        onSelect={() => onModeChange('delivery')}
        icon={<Home size={22} />}
        title={product ? 'Despacho' : 'Despacho a domicilio'}
        subtitle={disabledModes?.delivery ?? 'Recíbelo en tu domicilio'}
        badge={dAvail ? <span className={cn('badge', availabilityStyle[dAvail])}>{availabilityLabel[dAvail]}</span> : undefined}
      >
        {product && (
          <ul className="space-y-1 text-sm text-ink-700">
            <li><strong>Entrega estimada:</strong> 2-4 días{mounted ? ` · entre el ${estimatedRange()}` : ''}</li>
            <li>
              {product.freeShipping || product.price >= FREE_SHIPPING_THRESHOLD
                ? 'Despacho gratis para este producto'
                : `Despacho ${formatCLP(SHIPPING_COST)} · gratis desde ${formatCLP(FREE_SHIPPING_THRESHOLD)}`}
            </li>
          </ul>
        )}
        {deliveryExtra}
      </Option>

      <Option
        name={`pickup-${uid}`}
        value="pickup"
        selected={mode === 'pickup'}
        disabled={Boolean(disabledModes?.pickup) || (product ? !pickupOk : false)}
        onSelect={() => onModeChange('pickup')}
        icon={<StoreIcon size={22} />}
        title={product ? 'Retiro' : 'Retiro en tienda'}
        subtitle={disabledModes?.pickup ?? 'Retira en una tienda'}
        badge={
          product ? (
            <span className={cn('badge', pickupOk ? availabilityStyle[pickupStates.every((a) => a === 'low' || a === 'none') ? 'low' : 'available'] : availabilityStyle.none)}>
              {pickupOk ? 'Gratis' : availabilityLabel.none}
            </span>
          ) : (
            <span className="badge bg-mint-50 text-mint-700">Gratis</span>
          )
        }
      >
        {!hideStoreList && (
          <StoreSelector value={storeId} onChange={onStoreChange} product={product} cartProducts={cartProducts} name={`store-${uid}`} compact={Boolean(product)} />
        )}
        {pickupExtra}
      </Option>
    </div>
  );
}
