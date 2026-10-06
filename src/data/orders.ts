import type { Address, Customer, DeliveryMode, Order, OrderItem, OrderStatus, PaymentMethod } from '@/types';
import { getProduct } from './products';
import { calcTotals } from '@/lib/pricing';

const customer: Customer = {
  name: 'Andrés',
  lastName: 'Soto',
  rut: '12.345.678-5',
  phone: '+56 9 8765 4321',
  email: 'andres.soto@correo.cl',
  newsletter: true,
};

const homeAddress: Address = {
  id: 'addr-casa',
  label: 'Casa',
  region: 'Ñuble',
  comuna: 'San Carlos',
  street: 'Calle Independencia',
  number: '1234',
  apartment: 'Depto 52',
  notes: 'Conserjería recibe encomiendas',
};

function make(
  id: string,
  createdAt: string,
  status: OrderStatus,
  mode: DeliveryMode,
  date: string,
  lines: [string, number][],
  payment: { method: PaymentMethod; label: string },
  storeId?: string,
): Order {
  const priced = lines.map(([pid, qty]) => ({ product: getProduct(pid)!, qty }));
  const totals = calcTotals(priced, mode);
  const items: OrderItem[] = priced.map(({ product, qty }) => ({
    productId: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    qty,
  }));
  return {
    id,
    createdAt,
    status,
    items,
    subtotal: totals.subtotal,
    discounts: totals.discounts,
    shipping: totals.shipping,
    total: totals.total,
    delivery: mode === 'pickup' ? { mode, storeId, date } : { mode, address: homeAddress, date },
    customer,
    payment,
    pointsEarned: Math.floor(totals.total / 100),
  };
}

export const mockOrders: Order[] = [
  make('MM-20261004-30945', '2026-10-04T19:30:00-03:00', 'shipping', 'delivery', '2026-10-06',
    [['smartwatch-fitline-s2', 1]], { method: 'credit', label: 'Tarjeta de crédito •••• 1107' }),
  make('MM-20261003-52718', '2026-10-03T11:42:00-03:00', 'preparing', 'delivery', '2026-10-07',
    [['audifonos-bluetooth-airwave-pro', 1], ['power-bank-20000-usb-c', 1]], { method: 'credit', label: 'Tarjeta de crédito •••• 4242' }),
  make('MM-20261001-48291', '2026-10-01T16:05:00-03:00', 'ready', 'pickup', '2026-10-05',
    [['perfume-noir-intense', 1], ['body-mist-vanilla-dream', 2]], { method: 'webpay', label: 'Webpay' }, 'chillan-centro'),
  make('MM-20260926-17342', '2026-09-26T09:18:00-03:00', 'delivered', 'delivery', '2026-09-29',
    [['detergente-liquido-ultra-3l', 1], ['suavizante-primavera-2-8l', 1], ['lavaloza-concentrado-limon-750', 2], ['papel-higienico-doble-hoja-24', 1]],
    { method: 'debit', label: 'Tarjeta de débito •••• 8815' }),
  make('MM-20260912-90456', '2026-09-12T13:50:00-03:00', 'delivered', 'pickup', '2026-09-13',
    [['shampoo-reparacion-total', 2], ['acondicionador-keratina-400', 2], ['crema-corporal-karite-400', 1]],
    { method: 'transfer', label: 'Transferencia bancaria' }, 'san-carlos'),
];
