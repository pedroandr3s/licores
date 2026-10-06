import type { Customer, Order, OrderItem, OrderStatus, PaymentMethod } from '@/types';
import { getProduct } from './products';
import { HOME_STORE_ID } from './stores';
import { calcTotals } from '@/lib/pricing';

const customer: Customer = {
  name: 'Andrés',
  lastName: 'Soto',
  rut: '12.345.678-5',
  phone: '+56 9 8765 4321',
  email: 'andres.soto@correo.cl',
  newsletter: true,
};

function make(
  id: string,
  createdAt: string,
  status: OrderStatus,
  date: string,
  lines: [string, number][],
  payment: { method: PaymentMethod; label: string },
): Order {
  const priced = lines.map(([pid, qty]) => ({ product: getProduct(pid)!, qty }));
  const totals = calcTotals(priced);
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
    total: totals.total,
    pickup: { storeId: HOME_STORE_ID, date },
    ageConfirmed: true,
    customer,
    payment,
    pointsEarned: Math.floor(totals.total / 100),
  };
}

export const mockOrders: Order[] = [
  make('ML-20261004-30945', '2026-10-04T19:30:00-03:00', 'preparing', '2026-10-06',
    [['whisky-blended-12-750', 1], ['hielo-cubos-2kg', 2], ['bebida-cola-3l', 1]], { method: 'credit', label: 'Tarjeta de crédito •••• 1107' }),
  make('ML-20261003-52718', '2026-10-03T11:42:00-03:00', 'ready', '2026-10-05',
    [['cerveza-lager-andina-pack-6', 3], ['papas-fritas-clasicas-250', 4], ['mix-coctel-500', 2]], { method: 'webpay', label: 'Webpay' }),
  make('ML-20260926-17342', '2026-09-26T09:18:00-03:00', 'delivered', '2026-09-27',
    [['vino-carmenere-gran-reserva-750', 2], ['vino-cabernet-reserva-750', 2]], { method: 'debit', label: 'Tarjeta de débito •••• 8815' }),
  make('ML-20260912-90456', '2026-09-12T13:50:00-03:00', 'delivered', '2026-09-13',
    [['pisco-reserva-40-750', 2], ['ginger-ale-15l', 4], ['papas-onduladas-bbq-180', 3]], { method: 'store', label: 'Pago en tienda' }),
];
