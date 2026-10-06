import type { Order, OrderStatus, PaymentMethod } from '@/types';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: 'Pedido recibido',
  preparing: 'Preparando',
  ready: 'Listo para retiro',
  delivered: 'Retirado',
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  received: 'bg-brand-50 text-brand-700',
  preparing: 'bg-sun-100 text-[#8a5a00]',
  ready: 'bg-mint-50 text-mint-700',
  delivered: 'bg-ink-100 text-ink-600',
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  credit: 'Tarjeta de crédito',
  debit: 'Tarjeta de débito',
  transfer: 'Transferencia',
  webpay: 'Webpay',
  store: 'Pago en tienda',
};

export const STATUS_FLOW: OrderStatus[] = ['received', 'preparing', 'ready', 'delivered'];

export function nextStatus(order: Order): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(order.status);
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

export function isActiveOrder(order: Order) {
  return order.status !== 'delivered';
}

export function generateOrderId(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const n = String(Math.floor(10000 + Math.random() * 90000));
  return `ML-${y}${m}${d}-${n}`;
}
