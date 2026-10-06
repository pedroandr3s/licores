import type { Reward } from '@/types';

export const rewards: Reward[] = [
  { id: 'vale-3000', title: 'Vale de compra $3.000', description: 'Úsalo en tu próximo pedido online o en el local.', points: 1200, shape: 'box', colors: ['#a8213f', '#e8b53a'] },
  { id: 'bolsa-hielo', title: '2 bolsas de hielo de 2 kg', description: 'Para que no falte el hielo en la próxima junta.', points: 500, shape: 'bag', colors: ['#2f9bd8', '#bfe6fa'] },
  { id: 'papas-mix', title: 'Pack de 3 papas fritas', description: 'Tres bolsas de papas fritas a elección.', points: 700, shape: 'bag', colors: ['#e8543a', '#ffe08a'] },
  { id: 'copas-vino', title: 'Set de 2 copas de vino', description: 'Copas de cristal para disfrutar tu próximo tinto.', points: 1800, shape: 'wine', colors: ['#7a1f3d', '#e8c6a0'] },
  { id: 'vale-10000', title: 'Vale de compra $10.000', description: 'El canje más conveniente para tus compras grandes.', points: 4000, shape: 'box', colors: ['#14122b', '#e8b53a'] },
  { id: 'vaso-cerveza', title: 'Vaso cervecero Oasis', description: 'Vaso de vidrio de 500 ml con el logo de la casa.', points: 900, shape: 'drink', colors: ['#e8a600', '#7a4a00'] },
];
