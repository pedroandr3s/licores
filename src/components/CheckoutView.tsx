'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, CreditCard, Landmark, Loader2, Lock, Pencil, ShieldCheck, ShoppingBag, TriangleAlert, Wallet } from 'lucide-react';
import type { Address, Order, PaymentMethod } from '@/types';
import { regions } from '@/data/regions';
import { getStore } from '@/data/stores';
import { cartStoreAvailability } from '@/lib/availability';
import { getDateOptions, formatISOLong } from '@/lib/dates';
import { formatCLP, cn } from '@/lib/format';
import { formatRut, validateRut } from '@/lib/rut';
import { generateOrderId, PAYMENT_LABEL } from '@/lib/orders';
import { useCartTotals, useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { useMounted } from '@/hooks/useMounted';
import Breadcrumbs from './Breadcrumbs';
import CheckoutSteps from './CheckoutSteps';
import DeliverySelector from './DeliverySelector';
import OrderSummary from './OrderSummary';
import EmptyState from './EmptyState';
import { CheckField, SelectField, TextField } from './Field';
import { BlockSkeleton } from './Skeletons';

type Errors = Record<string, string>;
const STEPS = ['Entrega', 'Tus datos', 'Pago', 'Confirmación'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONFLICT_MSG = 'Tu carrito mezcla productos que solo se retiran con otros que solo se despachan.';

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, '').replace(/^56/, '').slice(0, 9);
  if (d.length <= 1) return d;
  if (d.length <= 5) return `${d.slice(0, 1)} ${d.slice(1)}`;
  return `${d.slice(0, 1)} ${d.slice(1, 5)} ${d.slice(5)}`;
};

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: typeof CreditCard }[] = [
  { id: 'credit', label: 'Tarjeta de crédito', sub: 'Hasta 12 cuotas sin interés', icon: CreditCard },
  { id: 'debit', label: 'Tarjeta de débito', sub: 'Cargo inmediato', icon: Wallet },
  { id: 'transfer', label: 'Transferencia', sub: 'Pagas desde tu banco', icon: Landmark },
  { id: 'webpay', label: 'Webpay', sub: 'Paga en el portal seguro', icon: ShieldCheck },
];

export default function CheckoutView() {
  const router = useRouter();
  const { hydrated, user, deliveryMode, selectedStoreId, addresses, dispatch } = useStore();
  const { toast, openLogin } = useUI();
  const totals = useCartTotals();
  const mounted = useMounted();

  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [addr, setAddr] = useState({ region: 'Ñuble', comuna: '', street: '', number: '', apartment: '', notes: '' });
  const [saveAddr, setSaveAddr] = useState(false);
  const [dateISO, setDateISO] = useState('');
  const [cust, setCust] = useState({ name: '', lastName: '', rut: '', phone: '', email: '', newsletter: false });
  const [pay, setPay] = useState({ method: '' as PaymentMethod | '', number: '', holder: '', expiry: '', cvv: '', installments: '1', accept: false });
  const prefilled = useRef(false);

  const products = useMemo(() => totals.lines.map((l) => l.product), [totals.lines]);
  const canDelivery = products.every((p) => p.availableForDelivery);
  const canPickup = products.every((p) => p.availableForPickup);
  const conflict = !canDelivery && !canPickup;
  const mode = deliveryMode;
  const dateOptions = useMemo(() => (mounted ? getDateOptions(mode) : []), [mounted, mode]);
  const store = getStore(selectedStoreId);

  // Prefill con los datos del usuario simulado
  useEffect(() => {
    if (!hydrated || prefilled.current || !user) return;
    prefilled.current = true;
    setCust((c) => ({
      ...c,
      name: c.name || user.name,
      lastName: c.lastName || user.lastName || '',
      email: c.email || user.email,
      phone: c.phone || formatPhone(user.phone ?? ''),
    }));
  }, [hydrated, user]);

  // Si la modalidad actual no aplica al carrito, cambiar a la otra
  useEffect(() => {
    if (!hydrated || products.length === 0) return;
    if (mode === 'delivery' && !canDelivery && canPickup) dispatch({ type: 'SET_MODE', mode: 'pickup' });
    if (mode === 'pickup' && !canPickup && canDelivery) dispatch({ type: 'SET_MODE', mode: 'delivery' });
  }, [hydrated, products.length, mode, canDelivery, canPickup, dispatch]);

  // Tienda por defecto para retiro
  useEffect(() => {
    if (!hydrated || mode !== 'pickup' || products.length === 0) return;
    const current = selectedStoreId && cartStoreAvailability(products, selectedStoreId) !== 'none';
    if (!current) {
      const fallback = ['san-carlos', 'chillan-centro', 'chillan-norte', 'bulnes', 'yungay'].find((id) => cartStoreAvailability(products, id) !== 'none');
      dispatch({ type: 'SET_STORE', storeId: fallback ?? null });
    }
  }, [hydrated, mode, products, selectedStoreId, dispatch]);

  // Fecha por defecto
  useEffect(() => {
    if (dateOptions.length && !dateOptions.some((o) => o.iso === dateISO)) setDateISO(dateOptions[0].iso);
  }, [dateOptions, dateISO]);

  const clear = (k: string) => errors[k] && setErrors((e) => ({ ...e, [k]: '' }));
  const setA = (k: keyof typeof addr, v: string) => { setAddr((a) => ({ ...a, [k]: v, ...(k === 'region' ? { comuna: '' } : {}) })); clear(k); };
  const setC = (k: keyof typeof cust, v: string | boolean) => { setCust((c) => ({ ...c, [k]: v })); clear(k); };
  const setP = (k: keyof typeof pay, v: string | boolean) => { setPay((p) => ({ ...p, [k]: v })); clear(k); };

  const comunas = regions.find((r) => r.name === addr.region)?.comunas ?? [];

  /* ───────── validaciones ───────── */
  const validateDelivery = (): Errors => {
    const er: Errors = {};
    if (conflict) er.conflict = CONFLICT_MSG;
    if (mode === 'delivery') {
      if (!addr.region) er.region = 'Selecciona tu región';
      if (!addr.comuna) er.comuna = 'Selecciona tu comuna';
      if (addr.street.trim().length < 3) er.street = 'Ingresa el nombre de tu calle';
      if (!addr.number.trim()) er.number = 'Ingresa el número';
    } else if (!selectedStoreId || cartStoreAvailability(products, selectedStoreId) === 'none') {
      er.store = 'Selecciona una tienda con disponibilidad';
    }
    if (!dateISO) er.date = 'Selecciona una fecha';
    return er;
  };

  const validateCustomer = (): Errors => {
    const er: Errors = {};
    if (cust.name.trim().length < 2) er.name = 'Ingresa tu nombre';
    if (cust.lastName.trim().length < 2) er.lastName = 'Ingresa tu apellido';
    if (!validateRut(cust.rut)) er.rut = 'Ingresa un RUT válido, por ejemplo 12.345.678-5';
    if (!/^9\d{8}$/.test(cust.phone.replace(/\D/g, ''))) er.phone = 'Ingresa un celular de 9 dígitos que parta con 9';
    if (!EMAIL_RE.test(cust.email.trim())) er.email = 'Ingresa un correo válido, por ejemplo nombre@correo.cl';
    return er;
  };

  const validatePayment = (): Errors => {
    const er: Errors = {};
    if (!pay.method) er.method = 'Elige un método de pago';
    if (pay.method === 'credit' || pay.method === 'debit') {
      if (pay.number.replace(/\D/g, '').length !== 16) er.number = 'El número de tarjeta debe tener 16 dígitos';
      if (pay.holder.trim().length < 3) er.holder = 'Ingresa el nombre como aparece en la tarjeta';
      const m = pay.expiry.match(/^(\d{2})\/(\d{2})$/);
      const now = new Date();
      if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) er.expiry = 'Usa el formato MM/AA';
      else if (2000 + Number(m[2]) < now.getFullYear() || (2000 + Number(m[2]) === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)) er.expiry = 'La tarjeta está vencida';
      if (!/^\d{3,4}$/.test(pay.cvv)) er.cvv = 'Ingresa 3 o 4 dígitos';
    }
    if (!pay.accept) er.accept = 'Debes aceptar los términos y condiciones para continuar';
    return er;
  };

  const goStep = (i: number) => {
    setErrors({});
    setStep(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirm = () => {
    const er = validatePayment();
    setErrors(er);
    if (Object.keys(er).length) return;
    setProcessing(true);
    window.setTimeout(() => {
      const now = new Date();
      const last4 = pay.number.replace(/\D/g, '').slice(-4);
      const method = pay.method as PaymentMethod;
      const label =
        method === 'credit' || method === 'debit'
          ? `${PAYMENT_LABEL[method]} •••• ${last4}`
          : method === 'transfer'
            ? 'Transferencia bancaria'
            : 'Webpay';
      const address: Address = { id: `addr-${now.getTime()}`, label: 'Despacho', region: addr.region, comuna: addr.comuna, street: addr.street.trim(), number: addr.number.trim(), apartment: addr.apartment.trim() || undefined, notes: addr.notes.trim() || undefined };
      const order: Order = {
        id: generateOrderId(now),
        createdAt: now.toISOString(),
        status: 'received',
        items: totals.lines.map(({ product, qty }) => ({ productId: product.id, name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, qty })),
        subtotal: totals.subtotal,
        discounts: totals.discounts,
        shipping: totals.shipping,
        total: totals.total,
        delivery: mode === 'pickup' ? { mode, storeId: selectedStoreId ?? undefined, date: dateISO } : { mode, address, date: dateISO },
        customer: { name: cust.name.trim(), lastName: cust.lastName.trim(), rut: formatRut(cust.rut), phone: `+56 ${cust.phone.trim()}`, email: cust.email.trim(), newsletter: cust.newsletter },
        payment: { method, label },
        pointsEarned: Math.floor(totals.total / 100),
      };
      if (saveAddr && user && mode === 'delivery') dispatch({ type: 'ADDR_ADD', address: { ...address, label: `Dirección ${addresses.length + 1}` } });
      dispatch({ type: 'ORDER_ADD', order });
      router.push(`/checkout/confirmacion?pedido=${order.id}`);
    }, 1600);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (processing) return;
    if (step === 0) {
      const er = validateDelivery();
      setErrors(er);
      if (Object.keys(er).length === 0) goStep(1);
    } else if (step === 1) {
      const er = validateCustomer();
      setErrors(er);
      if (Object.keys(er).length === 0) goStep(2);
    } else confirm();
  };

  /* ───────── estados vacíos ───────── */
  if (!hydrated) {
    return (
      <div className="container-page py-8">
        <BlockSkeleton className="h-10 w-72" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]"><BlockSkeleton className="h-[480px]" /><BlockSkeleton className="h-80" /></div>
      </div>
    );
  }

  if (totals.lines.length === 0 && !processing) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState headingLevel="h1" icon={ShoppingBag} title="Tu carrito está vacío" description="Agrega productos para poder continuar con tu compra.">
          <Link href="/productos" className="btn btn-primary btn-lg">Seguir comprando</Link>
        </EmptyState>
      </div>
    );
  }

  /* ───────── piezas de UI ───────── */
  const dateChooser = (
    <div className={cn(mode === 'delivery' && 'mt-5')}>
      <p className="text-sm font-bold text-ink-700">{mode === 'delivery' ? 'Fecha estimada de entrega' : 'Fecha de retiro'}</p>
      <div role="radiogroup" aria-label="Fecha" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {dateOptions.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-[62px]" />)
          : dateOptions.map((o) => (
              <button
                key={o.iso}
                type="button"
                role="radio"
                aria-checked={dateISO === o.iso}
                onClick={() => { setDateISO(o.iso); clear('date'); }}
                className={cn('rounded-xl border px-3 py-2.5 text-left transition', dateISO === o.iso ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20' : 'border-ink-200 bg-white hover:border-brand-300')}
              >
                <span className="block text-[15px] font-extrabold">{o.label}</span>
                <span className="block text-xs text-ink-500">{o.hint}</span>
              </button>
            ))}
      </div>
      {errors.date && <p className="field-error">{errors.date}</p>}
    </div>
  );

  const addressForm = (
    <div>
      {addresses.length > 0 && (
        <SelectField
          id="saved-address"
          label="Usar una dirección guardada"
          className="mb-4"
          value=""
          placeholder="Selecciona una dirección"
          options={addresses.map((a) => ({ value: a.id, label: `${a.label} — ${a.street} ${a.number}, ${a.comuna}` }))}
          onChange={(id) => {
            const a = addresses.find((x) => x.id === id);
            if (a) setAddr({ region: a.region, comuna: a.comuna, street: a.street, number: a.number, apartment: a.apartment ?? '', notes: a.notes ?? '' });
          }}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="region" label="Región" value={addr.region} onChange={(v) => setA('region', v)} options={regions.map((r) => ({ value: r.name, label: r.name }))} error={errors.region} autoComplete="address-level1" />
        <SelectField id="comuna" label="Comuna" value={addr.comuna} onChange={(v) => setA('comuna', v)} options={comunas.map((c) => ({ value: c, label: c }))} placeholder="Selecciona tu comuna" error={errors.comuna} autoComplete="address-level2" />
        <TextField id="street" label="Calle" value={addr.street} onChange={(v) => setA('street', v)} error={errors.street} autoComplete="address-line1" placeholder="Av. Libertad" />
        <div className="grid grid-cols-2 gap-4">
          <TextField id="number" label="Número" value={addr.number} onChange={(v) => setA('number', v)} error={errors.number} inputMode="numeric" placeholder="1234" />
          <TextField id="apartment" label="Departamento" value={addr.apartment} onChange={(v) => setA('apartment', v)} optional placeholder="52" />
        </div>
        <TextField id="notes" label="Información adicional" className="sm:col-span-2" value={addr.notes} onChange={(v) => setA('notes', v)} optional placeholder="Ej.: dejar con conserjería, timbre malo" />
      </div>
      {user && (
        <div className="mt-4"><CheckField id="save-address" checked={saveAddr} onChange={setSaveAddr}>Guardar esta dirección en mi cuenta</CheckField></div>
      )}
      {dateChooser}
    </div>
  );

  const summaryDelivery =
    mode === 'pickup'
      ? `Retiro en ${store?.name ?? 'tienda'}`
      : `Despacho a ${addr.street} ${addr.number}${addr.apartment ? `, ${addr.apartment}` : ''}, ${addr.comuna}`;

  const primaryLabel = step === 0 ? 'Continuar a tus datos' : step === 1 ? 'Continuar al pago' : 'Confirmar compra';

  return (
    <div className="container-page pb-32 pt-5 md:pb-12 md:pt-8 lg:pb-12">
      <Breadcrumbs items={[{ label: 'Carrito', href: '/carrito' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 text-[28px] font-extrabold md:text-4xl">Finalizar compra</h1>

      <div className="card mt-5 px-4 py-4 sm:px-6"><CheckoutSteps steps={STEPS} current={step} onGo={goStep} /></div>

      {/* Resumen colapsable (móvil) */}
      <details className="card group mt-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 font-extrabold"><ShoppingBag size={18} className="text-brand-600" /> Resumen del pedido <ChevronDown size={16} className="transition-transform group-open:rotate-180" /></span>
          <span className="font-display text-xl font-extrabold">{formatCLP(totals.total)}</span>
        </summary>
        <div className="border-t border-ink-100 p-3"><OrderSummary lines={totals.lines} totals={totals} mode={mode} showItems showProgress={false} title="Tu compra" /></div>
      </details>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <form id="checkout-form" onSubmit={submit} noValidate className="card p-5 sm:p-7" aria-label={STEPS[step]}>
          {/* Resumen de pasos completados */}
          {step > 0 && (
            <div className="mb-6 space-y-2 rounded-2xl bg-ink-50 p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <p><span className="font-bold">Entrega:</span> {summaryDelivery} · {dateISO && mounted ? formatISOLong(dateISO) : ''}</p>
                <button type="button" onClick={() => goStep(0)} className="inline-flex shrink-0 items-center gap-1 font-bold text-brand-700 hover:underline"><Pencil size={13} /> Editar</button>
              </div>
              {step > 1 && (
                <div className="flex items-start justify-between gap-3">
                  <p><span className="font-bold">Datos:</span> {cust.name} {cust.lastName} · {cust.rut ? formatRut(cust.rut) : ''} · {cust.email}</p>
                  <button type="button" onClick={() => goStep(1)} className="inline-flex shrink-0 items-center gap-1 font-bold text-brand-700 hover:underline"><Pencil size={13} /> Editar</button>
                </div>
              )}
            </div>
          )}

          {step === 0 && (
            <>
              <h2 className="text-2xl font-extrabold">¿Cómo quieres recibir tu compra?</h2>
              <p className="mt-1 text-ink-500">Elige despacho a domicilio o retiro gratis en una tienda.</p>
              {conflict && (
                <div role="alert" className="mt-4 flex gap-3 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">
                  <TriangleAlert size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">{CONFLICT_MSG}</p>
                    <p className="mt-1">Elimina alguno de estos productos del carrito para continuar:</p>
                    <ul className="mt-1 list-disc pl-5">
                      {totals.lines.filter((l) => !l.product.availableForDelivery || !l.product.availableForPickup).map((l) => (
                        <li key={l.product.id}>{l.product.name} ({!l.product.availableForDelivery ? 'solo retiro' : 'solo despacho'})</li>
                      ))}
                    </ul>
                    <Link href="/carrito" className="mt-2 inline-block font-bold underline">Ir al carrito</Link>
                  </div>
                </div>
              )}
              <div className="mt-5">
                <DeliverySelector
                  mode={mode}
                  onModeChange={(m) => { dispatch({ type: 'SET_MODE', mode: m }); setErrors({}); }}
                  storeId={selectedStoreId}
                  onStoreChange={(id) => { dispatch({ type: 'SET_STORE', storeId: id }); clear('store'); }}
                  cartProducts={products}
                  disabledModes={{
                    delivery: !canDelivery ? 'Algunos productos de tu carrito solo se retiran en tienda' : undefined,
                    pickup: !canPickup ? 'Algunos productos de tu carrito solo se despachan' : undefined,
                  }}
                  deliveryExtra={addressForm}
                  pickupExtra={<div className="mt-5">{errors.store && <p className="field-error mb-3">{errors.store}</p>}{dateChooser}</div>}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-extrabold">Tus datos</h2>
              <p className="mt-1 text-ink-500">Los usaremos para avisarte del estado de tu pedido.</p>
              {!user && (
                <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
                  ¿Ya tienes cuenta? <button type="button" onClick={() => openLogin('login')} className="font-bold underline">Inicia sesión</button> y completamos tus datos.
                </p>
              )}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <TextField id="c-name" label="Nombre" value={cust.name} onChange={(v) => setC('name', v)} error={errors.name} autoComplete="given-name" />
                <TextField id="c-last" label="Apellido" value={cust.lastName} onChange={(v) => setC('lastName', v)} error={errors.lastName} autoComplete="family-name" />
                <TextField id="c-rut" label="RUT" value={cust.rut} onChange={(v) => setC('rut', v)} onBlur={() => cust.rut && setC('rut', formatRut(cust.rut))} error={errors.rut} placeholder="12.345.678-5" hint="Con dígito verificador" maxLength={12} />
                <TextField id="c-phone" label="Teléfono" prefix="+56" value={cust.phone} onChange={(v) => setC('phone', formatPhone(v))} error={errors.phone} inputMode="tel" autoComplete="tel-national" placeholder="9 1234 5678" />
                <TextField id="c-email" label="Email" className="sm:col-span-2" type="email" value={cust.email} onChange={(v) => setC('email', v)} error={errors.email} autoComplete="email" placeholder="nombre@correo.cl" />
              </div>
              <div className="mt-5"><CheckField id="c-news" checked={cust.newsletter} onChange={(v) => setC('newsletter', v)}>Quiero recibir novedades y promociones</CheckField></div>
              <button type="button" onClick={() => { setCust({ name: 'Andrés', lastName: 'Soto', rut: '12.345.678-5', phone: '9 8765 4321', email: 'andres.soto@correo.cl', newsletter: true }); setErrors({}); }} className="mt-4 text-sm font-bold text-brand-700 hover:underline">
                Autocompletar con datos de demostración
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-extrabold">Método de pago</h2>
              <p className="mt-1 flex items-center gap-1.5 text-ink-500"><Lock size={15} /> Demostración: no se procesa ningún pago real ni se guardan datos de tarjetas.</p>

              <div role="radiogroup" aria-label="Método de pago" className="mt-5 grid gap-3 sm:grid-cols-2">
                {METHODS.map((m) => {
                  const sel = pay.method === m.id;
                  return (
                    <label key={m.id} className={cn('flex cursor-pointer items-center gap-3.5 rounded-2xl border bg-white p-4 transition', sel ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-ink-200 hover:border-brand-300')}>
                      <input type="radio" name="pay-method" value={m.id} checked={sel} onChange={() => setP('method', m.id)} className="sr-only" />
                      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', sel ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600')}><m.icon size={22} /></span>
                      <span className="leading-tight"><span className="block font-extrabold">{m.label}</span><span className="block text-sm text-ink-500">{m.sub}</span></span>
                    </label>
                  );
                })}
              </div>
              {errors.method && <p className="field-error">{errors.method}</p>}

              {(pay.method === 'credit' || pay.method === 'debit') && (
                <div className="mt-5 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField id="p-number" label="Número de tarjeta" className="sm:col-span-2" value={pay.number} onChange={(v) => setP('number', formatCard(v))} error={errors.number} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" />
                    <TextField id="p-holder" label="Nombre en la tarjeta" className="sm:col-span-2" value={pay.holder} onChange={(v) => setP('holder', v)} error={errors.holder} autoComplete="off" placeholder="ANDRÉS SOTO" />
                    <TextField id="p-expiry" label="Vencimiento" value={pay.expiry} onChange={(v) => setP('expiry', formatExpiry(v))} error={errors.expiry} inputMode="numeric" autoComplete="off" placeholder="MM/AA" maxLength={5} />
                    <TextField id="p-cvv" label="CVV" value={pay.cvv} onChange={(v) => setP('cvv', v.replace(/\D/g, '').slice(0, 4))} error={errors.cvv} inputMode="numeric" autoComplete="off" placeholder="123" maxLength={4} />
                    {pay.method === 'credit' && (
                      <SelectField id="p-inst" label="Cuotas" className="sm:col-span-2" value={pay.installments} onChange={(v) => setP('installments', v)} options={[1, 3, 6, 12].map((n) => ({ value: String(n), label: n === 1 ? 'Sin cuotas · ' + formatCLP(totals.total) : `${n} cuotas sin interés · ${formatCLP(Math.round(totals.total / n))} c/u` }))} />
                    )}
                  </div>
                  <button type="button" onClick={() => { setPay((p) => ({ ...p, number: '4242 4242 4242 4242', holder: 'ANDRÉS SOTO', expiry: '12/30', cvv: '123' })); setErrors({}); }} className="mt-4 text-sm font-bold text-brand-700 hover:underline">
                    Usar tarjeta de prueba
                  </button>
                </div>
              )}
              {pay.method === 'transfer' && (
                <div className="mt-5 rounded-2xl border border-ink-100 bg-ink-50/60 p-5 text-[15px]">
                  <p className="font-bold">Datos para transferir (ficticios)</p>
                  <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-1.5">
                    <dt className="text-ink-500">Banco</dt><dd className="font-semibold">Banco Demo</dd>
                    <dt className="text-ink-500">Cuenta</dt><dd className="font-semibold">Corriente 000-0000-00</dd>
                    <dt className="text-ink-500">Titular</dt><dd className="font-semibold">MIXMARKET Demo SpA</dd>
                    <dt className="text-ink-500">Monto</dt><dd className="font-semibold">{formatCLP(totals.total)}</dd>
                  </dl>
                  <p className="mt-3 text-sm text-ink-500">En una tienda real, tu pedido quedaría pendiente hasta confirmar el pago.</p>
                </div>
              )}
              {pay.method === 'webpay' && (
                <div className="mt-5 rounded-2xl border border-ink-100 bg-ink-50/60 p-5 text-[15px]">
                  <p className="font-bold">Pago con Webpay (simulado)</p>
                  <p className="mt-1 text-ink-600">Al confirmar, simularemos el retorno desde el portal de pago. No se abre ningún sitio externo.</p>
                </div>
              )}

              <div className="mt-6">
                <CheckField id="p-accept" checked={pay.accept} onChange={(v) => setP('accept', v)} error={errors.accept}>
                  Acepto los <Link href="/ayuda/terminos-y-condiciones" target="_blank" className="font-bold text-brand-700 underline">términos y condiciones</Link> de esta demostración.
                </CheckField>
              </div>
            </>
          )}

          {/* Botones (desktop) */}
          <div className="mt-7 hidden items-center justify-between gap-3 border-t border-ink-100 pt-5 lg:flex">
            {step > 0 ? <button type="button" onClick={() => goStep(step - 1)} className="btn btn-ghost">Volver</button> : <Link href="/carrito" className="btn btn-ghost">Volver al carrito</Link>}
            <button type="submit" disabled={processing || (step === 0 && conflict)} className="btn btn-primary btn-lg min-w-[260px]">
              {processing ? <><Loader2 size={20} className="animate-spin" /> Procesando…</> : primaryLabel}
            </button>
          </div>
        </form>

        <div className="hidden lg:sticky lg:top-[152px] lg:block">
          <OrderSummary lines={totals.lines} totals={totals} mode={mode} showItems title="Tu compra">
            <Link href="/carrito" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline"><Pencil size={13} /> Editar carrito</Link>
          </OrderSummary>
        </div>
      </div>

      {/* Barra fija (móvil) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 p-3 pb-safe shadow-[0_-8px_24px_rgba(20,18,43,.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {step > 0 && <button type="button" onClick={() => goStep(step - 1)} className="btn btn-outline h-12 px-4" aria-label="Volver al paso anterior">Volver</button>}
          <div className="leading-tight">
            <p className="text-xs font-semibold text-ink-500">Total</p>
            <p className="font-display text-xl font-extrabold">{formatCLP(totals.total)}</p>
          </div>
          <button type="submit" form="checkout-form" disabled={processing || (step === 0 && conflict)} className="btn btn-primary h-12 flex-1">
            {processing ? <><Loader2 size={19} className="animate-spin" /> Procesando…</> : primaryLabel}
          </button>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-white/90 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto animate-spin text-brand-600" />
            <p className="mt-4 text-xl font-extrabold">Procesando tu compra…</p>
            <p className="mt-1 text-ink-500">Simulación: no se realiza ningún cobro.</p>
          </div>
        </div>
      )}
    </div>
  );
}
