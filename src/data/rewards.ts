import type { Reward } from '@/types';

export const rewards: Reward[] = [
  { id: 'vale-5000', title: 'Vale de compra $5.000', description: 'Úsalo en tu próxima compra online o en tienda.', points: 2000, shape: 'box', colors: ['#6428e0', '#ffcf3a'] },
  { id: 'tote-bag', title: 'Tote bag MIXMARKET', description: 'Bolsa reutilizable de algodón con diseño exclusivo.', points: 600, shape: 'bag', colors: ['#fb4b32', '#ffe1db'] },
  { id: 'envio-gratis-3', title: '3 despachos gratis', description: 'Envío sin costo en tres compras, sin monto mínimo.', points: 900, shape: 'box', colors: ['#12b27a', '#c9f2de'] },
  { id: 'mini-perfume', title: 'Mini perfume 30 ml', description: 'Fragancia de viaje a elección entre 4 aromas.', points: 1200, shape: 'perfume', colors: ['#e5578a', '#f4c6d7'] },
  { id: 'termo-acero', title: 'Termo de acero 500 ml', description: 'Mantiene tus bebidas frías o calientes por 12 horas.', points: 1800, shape: 'drink', colors: ['#3a3856', '#bdb9d0'] },
  { id: 'vale-15000', title: 'Vale de compra $15.000', description: 'El canje más conveniente para tus compras grandes.', points: 5500, shape: 'box', colors: ['#14122b', '#ffcf3a'] },
];
