import type { Store } from '@/types';

export const stores: Store[] = [
  {
    id: 'san-carlos',
    name: 'MIXMARKET San Carlos',
    shortName: 'San Carlos',
    address: "Av. O'Higgins 450, San Carlos",
    city: 'San Carlos',
    phone: '+56 42 220 1450',
    hoursLabel: 'Lunes a sábado 09:00 - 20:00',
    hours: { weekdays: [9, 20], saturday: [9, 20], sunday: null },
    distanceKm: 1.2,
    services: ['Retiro en tienda en 2 horas', 'Cambios y devoluciones', 'Estacionamiento', 'Punto Club MIXMARKET'],
    description: 'Nuestra tienda de origen, en pleno centro de San Carlos. Retira tus compras online en menos de 2 horas.',
    map: { x: 24, y: 38 },
  },
  {
    id: 'chillan-centro',
    name: 'MIXMARKET Chillán Centro',
    shortName: 'Chillán Centro',
    address: 'Arauco 650, Chillán',
    city: 'Chillán',
    phone: '+56 42 220 1650',
    hoursLabel: 'Lunes a domingo 10:00 - 21:00',
    hours: { weekdays: [10, 21], saturday: [10, 21], sunday: [10, 21] },
    distanceKm: 34.8,
    services: ['Retiro en tienda en 2 horas', 'Cambios y devoluciones', 'Atención de reclamos', 'Punto Club MIXMARKET'],
    description: 'La tienda más grande de la región, con todas las categorías y atención los siete días de la semana.',
    map: { x: 50, y: 56 },
  },
  {
    id: 'chillan-norte',
    name: 'MIXMARKET Chillán Norte',
    shortName: 'Chillán Norte',
    address: 'Av. Collín 1280, Chillán',
    city: 'Chillán',
    phone: '+56 42 220 1280',
    hoursLabel: 'Lunes a sábado 09:30 - 20:30',
    hours: { weekdays: [9.5, 20.5], saturday: [9.5, 20.5], sunday: null },
    distanceKm: 32.1,
    services: ['Retiro en tienda en 2 horas', 'Cambios y devoluciones', 'Estacionamiento'],
    description: 'Ubicada en el sector norte de Chillán, con amplio estacionamiento y retiro exprés.',
    map: { x: 46, y: 40 },
  },
  {
    id: 'bulnes',
    name: 'MIXMARKET Bulnes',
    shortName: 'Bulnes',
    address: 'Av. Arturo Prat 320, Bulnes',
    city: 'Bulnes',
    phone: '+56 42 220 0320',
    hoursLabel: 'Lunes a sábado 09:00 - 19:30',
    hours: { weekdays: [9, 19.5], saturday: [9, 19.5], sunday: null },
    distanceKm: 48.5,
    services: ['Retiro en tienda', 'Cambios y devoluciones'],
    description: 'Tienda de barrio con los productos más buscados y retiro de pedidos online.',
    map: { x: 66, y: 68 },
  },
  {
    id: 'yungay',
    name: 'MIXMARKET Yungay',
    shortName: 'Yungay',
    address: 'Av. Libertad 215, Yungay',
    city: 'Yungay',
    phone: '+56 42 220 0215',
    hoursLabel: 'Lunes a sábado 09:30 - 19:00',
    hours: { weekdays: [9.5, 19], saturday: [9.5, 19], sunday: null },
    distanceKm: 61.3,
    services: ['Retiro en tienda', 'Cambios y devoluciones', 'Estacionamiento'],
    description: 'Nuestra tienda más al sur, pensada para quienes compran por internet y retiran sin esperas.',
    map: { x: 80, y: 82 },
  },
];

export const getStore = (id: string | null | undefined): Store | undefined =>
  stores.find((s) => s.id === id);

const HOME_STORE_ID = 'san-carlos';
export { HOME_STORE_ID };

/** Calcula si la tienda está abierta ahora (se usa solo en cliente). */
export function storeStatus(store: Store, now: Date): { open: boolean; label: string } {
  const day = now.getDay();
  const range = day === 0 ? store.hours.sunday : day === 6 ? store.hours.saturday : store.hours.weekdays;
  const hour = now.getHours() + now.getMinutes() / 60;
  const fmt = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };
  if (range && hour >= range[0] && hour < range[1]) {
    return { open: true, label: `Abierto · cierra a las ${fmt(range[1])}` };
  }
  return { open: false, label: 'Cerrado ahora' };
}
