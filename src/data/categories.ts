import type { Category, CategorySlug } from '@/types';

export const categories: Category[] = [
  {
    slug: 'perfumeria',
    name: 'Perfumería',
    tagline: 'Fragancias para todos los días',
    icon: 'SprayCan',
    subcategories: ['Perfumes hombre', 'Perfumes mujer', 'Colonias', 'Body mist', 'Sets de regalo'],
    colors: ['#ffe3ee', '#e85d8a'],
    heroProductId: 'perfume-noir-intense',
  },
  {
    slug: 'cuidado-personal',
    name: 'Cuidado personal',
    tagline: 'Pelo, piel y sonrisa',
    icon: 'Droplets',
    subcategories: ['Cuidado del cabello', 'Cuidado corporal', 'Higiene bucal', 'Desodorantes', 'Jabones'],
    colors: ['#d9f5e6', '#1f9d6b'],
    heroProductId: 'shampoo-reparacion-total',
  },
  {
    slug: 'limpieza',
    name: 'Limpieza',
    tagline: 'Casa limpia, sin complicarte',
    icon: 'Sparkles',
    subcategories: ['Ropa', 'Superficies', 'Cocina', 'Papel y desechables'],
    colors: ['#dff1ff', '#2f8de0'],
    heroProductId: 'detergente-liquido-ultra-3l',
  },
  {
    slug: 'hogar',
    name: 'Hogar',
    tagline: 'Detalles que cambian tu casa',
    icon: 'Sofa',
    subcategories: ['Dormitorio', 'Iluminación', 'Cocina y mesa', 'Organización'],
    colors: ['#fff0d6', '#e68a1c'],
    heroProductId: 'lampara-mesa-nordica',
  },
  {
    slug: 'tecnologia',
    name: 'Tecnología',
    tagline: 'Audio, accesorios y smart',
    icon: 'Headphones',
    subcategories: ['Audio', 'Wearables', 'Cargadores y baterías', 'Computación'],
    colors: ['#e3e6ff', '#4a54e1'],
    heroProductId: 'audifonos-bluetooth-airwave-pro',
  },
  {
    slug: 'snacks',
    name: 'Snacks',
    tagline: 'Para picar a cualquier hora',
    icon: 'Cookie',
    subcategories: ['Salados', 'Dulces', 'Frutos secos', 'Barras'],
    colors: ['#fff2c2', '#e8a600'],
    heroProductId: 'papas-fritas-crunchy-250',
  },
  {
    slug: 'bebidas',
    name: 'Bebidas',
    tagline: 'Agua, jugos, café y más',
    icon: 'CupSoda',
    subcategories: ['Aguas', 'Jugos y néctares', 'Café', 'Vinos', 'Bebidas'],
    colors: ['#ffe4dc', '#e8543a'],
    heroProductId: 'vino-reserva-cabernet-750',
  },
  {
    slug: 'mascotas',
    name: 'Mascotas',
    tagline: 'Lo mejor para tu compañero',
    icon: 'PawPrint',
    subcategories: ['Perros', 'Gatos', 'Accesorios'],
    colors: ['#e8f0d6', '#7a9b2a'],
    heroProductId: 'alimento-perro-adulto-15kg',
  },
  {
    slug: 'belleza',
    name: 'Belleza',
    tagline: 'Maquillaje y skincare',
    icon: 'Brush',
    subcategories: ['Maquillaje labios', 'Maquillaje ojos', 'Rostro', 'Skincare'],
    colors: ['#f6e1ff', '#a63fd1'],
    heroProductId: 'labial-mate-cherry',
  },
  {
    slug: 'infantil',
    name: 'Infantil',
    tagline: 'Bebés y peques felices',
    icon: 'Baby',
    subcategories: ['Pañales y toallitas', 'Juguetes', 'Alimentación bebé'],
    colors: ['#dcf4ff', '#2aa6c9'],
    heroProductId: 'bloques-construccion-120',
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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
