import type { Category, CategorySlug } from '@/types';

export const categories: Category[] = [
  {
    slug: 'cervezas',
    name: 'Cervezas',
    tagline: 'Lager, IPA, stout y packs para compartir',
    icon: 'Beer',
    subcategories: ['Lager', 'Ale e IPA', 'Artesanales', 'Importadas', 'Packs'],
    colors: ['#fdf0cf', '#c47a00'],
    heroProductId: 'cerveza-ipa-ruta-sur-355',
  },
  {
    slug: 'vinos',
    name: 'Vinos y espumantes',
    tagline: 'Tintos, blancos, rosé y burbujas',
    icon: 'Wine',
    subcategories: ['Tintos', 'Blancos', 'Rosé', 'Espumantes'],
    colors: ['#fbe3e8', '#a8213f'],
    heroProductId: 'vino-cabernet-reserva-750',
  },
  {
    slug: 'destilados',
    name: 'Destilados',
    tagline: 'Pisco, whisky, ron, gin y más',
    icon: 'GlassWater',
    subcategories: ['Pisco', 'Whisky', 'Ron', 'Vodka', 'Gin', 'Tequila'],
    colors: ['#f6e4c8', '#8a5a12'],
    heroProductId: 'whisky-blended-12-750',
  },
  {
    slug: 'licores',
    name: 'Licores y aperitivos',
    tagline: 'Cremas, amargos y aperitivos',
    icon: 'Martini',
    subcategories: ['Cremas', 'Aperitivos', 'Licores de café y hierbas'],
    colors: ['#f3e0f0', '#8e2f86'],
    heroProductId: 'aperitivo-spritz-naranja-750',
  },
  {
    slug: 'mixers',
    name: 'Bebidas y mixers',
    tagline: 'Para acompañar y preparar tragos',
    icon: 'CupSoda',
    subcategories: ['Bebidas', 'Aguas y tónicas', 'Energéticas', 'Jugos', 'Hielo'],
    colors: ['#dff1ff', '#2f8de0'],
    heroProductId: 'agua-tonica-pack-6',
  },
  {
    slug: 'snacks',
    name: 'Papas y snacks',
    tagline: 'Papas fritas, ramitas y todo para picar',
    icon: 'Cookie',
    subcategories: ['Papas fritas', 'Ramitas y maní', 'Chips y tortillas', 'Mix para picar'],
    colors: ['#fff2c2', '#e8a600'],
    heroProductId: 'papas-fritas-clasicas-250',
  },
];

export const categoryMap: Record<CategorySlug, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const subcategorySlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
