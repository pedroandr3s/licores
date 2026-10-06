import type { DeliveryMode, Order, OrderStatus, PaymentMethod } from '@/types';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: 'Pedido recibido',
  preparing: 'Preparando',
  ready: 'Listo para retiro',
  shipping: 'En camino',
  delivered: 'Entregado',
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  received: 'bg-brand-50 text-brand-700',
  preparing: 'bg-sun-100 text-[#8a5a00]',
  ready: 'bg-mint-50 text-mint-700',
  shipping: 'bg-[#e0f0ff] text-[#1c64b8]',
  delivered: 'bg-ink-100 text-ink-600',
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  credit: 'Tarjeta de crédito',
  debit: 'Tarjeta de débito',
  transfer: 'Transferencia',
  webpay: 'Webpay',
};

export function statusFlow(mode: DeliveryMode): OrderStatus[] {
  return mode === 'pickup'
    ? ['received', 'preparing', 'ready', 'delivered']
    : ['received', 'preparing', 'shipping', 'delivered'];
}

export function nextStatus(order: Order): OrderStatus | null {
  const flow = statusFlow(order.delivery.mode);
  const i = flow.indexOf(order.status);
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : null;
}

export function isActiveOrder(order: Order) {
  return order.status !== 'delivered';
}

export function generateOrderId(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const n = String(Math.floor(10000 + Math.random() * 90000));
  return `MM-${y}${m}${d}-${n}`;
}

export function deliveryLabel(mode: DeliveryMode) {
  return mode === 'pickup' ? 'Retiro en tienda' : 'Despacho a domicilio';
}
