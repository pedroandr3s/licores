import type { Store } from '@/types';

/** Oasis tiene un único local: todas las compras son con retiro en tienda. */
export const store: Store = {
  id: 'quirihue',
  name: 'Botillería Oasis',
  shortName: 'Quirihue',
  address: 'Avenida Prat 813, Quirihue',
  city: 'Quirihue',
  phone: '+56 42 220 1450',
  hoursLabel: 'Lunes a jueves 11:00 - 22:00 · Viernes y sábado 11:00 - 00:00 · Domingo 12:00 - 20:00',
  hours: { weekdays: [11, 22], saturday: [11, 24], sunday: [12, 20] },
  distanceKm: 1.2,
  services: ['Retiro en tienda en 1 hora', 'Pago en tienda con tarjeta o efectivo', 'Venta solo a mayores de 18 años'],
  description: 'Nuestro único local, en pleno centro de Quirihue. Compra online, retira en menos de 1 hora y recuerda llevar tu cédula de identidad.',
  map: { x: 50, y: 52 },
};

export const stores: Store[] = [store];

export const getStore = (id: string | null | undefined): Store | undefined =>
  id === store.id ? store : undefined;

export const HOME_STORE_ID = store.id;

/** Calcula si la tienda está abierta ahora (se usa solo en cliente). */
export function storeStatus(s: Store, now: Date): { open: boolean; label: string } {
  const day = now.getDay();
  const range = day === 0 ? s.hours.sunday : day === 6 || day === 5 ? s.hours.saturday : s.hours.weekdays;
  const hour = now.getHours() + now.getMinutes() / 60;
  const fmt = (h: number) => {
    const hh = Math.floor(h) % 24;
    const mm = Math.round((h - Math.floor(h)) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };
  if (range && hour >= range[0] && hour < range[1]) {
    return { open: true, label: `Abierto · cierra a las ${fmt(range[1])}` };
  }
  return { open: false, label: 'Cerrado ahora' };
}
