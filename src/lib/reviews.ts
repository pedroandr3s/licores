import type { Product } from '@/types';

export interface Review {
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

const AUTHORS = ['Camila R.', 'Matías S.', 'Francisca P.', 'Joaquín V.', 'Valentina M.', 'Sebastián A.', 'Daniela G.', 'Felipe C.', 'Constanza L.', 'Ignacio T.'];
const DATES = ['hace 3 días', 'hace 1 semana', 'hace 2 semanas', 'hace 1 mes', 'hace 2 meses'];

const TEXTS: Record<number, { title: string; body: string }[]> = {
  5: [
    { title: 'Excelente compra', body: 'Llegó antes de lo esperado y el producto es tal cual la descripción. Lo volvería a comprar sin dudar.' },
    { title: 'Superó mis expectativas', body: 'La calidad es muy buena para el precio que tiene. Lo recomiendo totalmente.' },
    { title: 'Muy conforme', body: 'Cumple con todo lo que promete. Además el retiro en tienda fue rápido y sin filas.' },
  ],
  4: [
    { title: 'Muy bueno', body: 'Buen producto por el precio. Le saco una estrella porque el empaque venía algo golpeado, pero funciona perfecto.' },
    { title: 'Cumple bien', body: 'Es lo que esperaba. Lo uso hace un par de semanas y no tengo reclamos.' },
  ],
  3: [
    { title: 'Cumple, sin más', body: 'Está bien para lo que cuesta, aunque esperaba un poco más de rendimiento.' },
  ],
};

function seed(s: string) {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function getReviews(p: Product): Review[] {
  const h = seed(p.id);
  const base = Math.round(p.rating);
  const ratings = [base, base, Math.max(3, base - 1), base >= 5 ? 5 : base + 1].map((r) => Math.min(5, r));
  return ratings.map((r, i) => {
    const pool = TEXTS[r] ?? TEXTS[5];
    const t = pool[(h + i) % pool.length];
    return {
      author: AUTHORS[(h + i * 3) % AUTHORS.length],
      rating: r,
      title: t.title,
      body: t.body,
      date: DATES[(h + i) % DATES.length],
      verified: (h + i) % 4 !== 0,
    };
  });
}

/** Distribución de estrellas aproximada para el resumen de opiniones. */
export function ratingBreakdown(p: Product) {
  const r = p.rating;
  const five = Math.min(88, Math.round(30 + (r - 3.5) * 42));
  const four = Math.round((100 - five) * 0.55);
  const three = Math.round((100 - five - four) * 0.5);
  const two = Math.round((100 - five - four - three) * 0.5);
  const one = 100 - five - four - three - two;
  return [
    { stars: 5, pct: five },
    { stars: 4, pct: four },
    { stars: 3, pct: three },
    { stars: 2, pct: two },
    { stars: 1, pct: one },
  ];
}
