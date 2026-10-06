import type { Product } from '@/types';
import { brands, products } from '@/data/products';
import { PAGE_SIZE } from './constants';
import { slugify } from './format';
import { searchProducts } from './search';

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'bestsellers' | 'rating';
export type PriceRange = '' | 'lt10' | '10-20' | '20-50' | 'gt50';
export type AvailFlag = 'stock' | 'pickup' | 'delivery';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio menor' },
  { value: 'price-desc', label: 'Precio mayor' },
  { value: 'bestsellers', label: 'Más vendidos' },
  { value: 'rating', label: 'Mejor valorados' },
];

export const PRICE_RANGES: { id: Exclude<PriceRange, ''>; label: string; test: (n: number) => boolean }[] = [
  { id: 'lt10', label: 'Menos de $10.000', test: (n) => n < 10000 },
  { id: '10-20', label: '$10.000 - $20.000', test: (n) => n >= 10000 && n < 20000 },
  { id: '20-50', label: '$20.000 - $50.000', test: (n) => n >= 20000 && n <= 50000 },
  { id: 'gt50', label: 'Más de $50.000', test: (n) => n > 50000 },
];

export const AVAIL_OPTIONS: { id: AvailFlag; label: string }[] = [
  { id: 'stock', label: 'Disponible' },
  { id: 'pickup', label: 'Retiro en tienda' },
  { id: 'delivery', label: 'Despacho' },
];

export const DISCOUNT_OPTIONS = [
  { value: 0, label: 'Cualquier descuento' },
  { value: 20, label: '20% o más' },
  { value: 30, label: '30% o más' },
  { value: 50, label: '50% o más' },
];

export interface CatalogFilters {
  q: string;
  category: string;
  sub: string;
  price: PriceRange;
  brands: string[]; // nombres
  avail: AvailFlag[];
  disc: number;
  sort: SortKey;
  page: number;
  isNew: boolean;
  offers: boolean;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: '',
  category: '',
  sub: '',
  price: '',
  brands: [],
  avail: [],
  disc: 0,
  sort: 'relevance',
  page: 1,
  isNew: false,
  offers: false,
};

type ParamsLike = { get(key: string): string | null };

const brandBySlug = new Map(brands.map((b) => [slugify(b), b]));
export const brandSlug = (b: string) => slugify(b);
export const brandFromSlug = (s: string) => brandBySlug.get(s);

export function parseFilters(sp: ParamsLike, category = ''): CatalogFilters {
  const price = (sp.get('precio') ?? '') as PriceRange;
  const sort = (sp.get('orden') ?? 'relevance') as SortKey;
  const disc = Number(sp.get('desc') ?? 0);
  const page = Math.max(1, Number(sp.get('pagina') ?? 1) || 1);
  const brandParam = sp.get('marca');
  const availParam = sp.get('disp');
  return {
    q: sp.get('q') ?? '',
    category,
    sub: sp.get('sub') ?? '',
    price: PRICE_RANGES.some((r) => r.id === price) ? price : '',
    brands: brandParam
      ? brandParam.split(',').map((s) => brandBySlug.get(s)).filter((b): b is string => Boolean(b))
      : [],
    avail: availParam
      ? (availParam.split(',').filter((a) => AVAIL_OPTIONS.some((o) => o.id === a)) as AvailFlag[])
      : [],
    disc: [20, 30, 50, 70].includes(disc) ? disc : 0,
    sort: SORT_OPTIONS.some((s) => s.value === sort) ? sort : 'relevance',
    page,
    isNew: sp.get('nuevo') === '1',
    offers: sp.get('ofertas') === '1',
  };
}

/** Serializa filtros a query string (sin "?"). La categoría va en la ruta, no en la query. */
export function toQuery(f: CatalogFilters): string {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.sub) p.set('sub', f.sub);
  if (f.price) p.set('precio', f.price);
  if (f.brands.length) p.set('marca', f.brands.map(brandSlug).join(','));
  if (f.avail.length) p.set('disp', f.avail.join(','));
  if (f.disc) p.set('desc', String(f.disc));
  if (f.sort !== 'relevance') p.set('orden', f.sort);
  if (f.page > 1) p.set('pagina', String(f.page));
  if (f.isNew) p.set('nuevo', '1');
  if (f.offers) p.set('ofertas', '1');
  return p.toString();
}

export function activeFilterCount(f: CatalogFilters) {
  return (
    (f.category ? 1 : 0) +
    (f.sub ? 1 : 0) +
    (f.price ? 1 : 0) +
    f.brands.length +
    f.avail.length +
    (f.disc ? 1 : 0)
  );
}

export function relevanceScore(p: Product) {
  return (p.featured ? 1000 : 0) + p.sold / 10 + p.discount;
}

export function applyFilters(f: CatalogFilters): Product[] {
  let list: Product[] = f.q ? searchProducts(f.q) : products.slice();
  if (f.category) list = list.filter((p) => p.category === f.category);
  if (f.sub) list = list.filter((p) => p.subcategory === f.sub);
  if (f.price) {
    const range = PRICE_RANGES.find((r) => r.id === f.price);
    if (range) list = list.filter((p) => range.test(p.price));
  }
  if (f.brands.length) list = list.filter((p) => f.brands.includes(p.brand));
  if (f.avail.includes('stock')) list = list.filter((p) => p.stock > 0);
  if (f.avail.includes('pickup')) list = list.filter((p) => p.availableForPickup && p.stock > 0);
  if (f.avail.includes('delivery')) list = list.filter((p) => p.availableForDelivery && p.stock > 0);
  if (f.disc) list = list.filter((p) => p.discount >= f.disc);
  if (f.isNew) list = list.filter((p) => p.isNew);
  if (f.offers) list = list.filter((p) => p.discount >= 30);

  const keepSearchOrder = f.q && f.sort === 'relevance';
  if (!keepSearchOrder) {
    const sorted = list.slice();
    switch (f.sort) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'bestsellers': sorted.sort((a, b) => b.sold - a.sold); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      default: sorted.sort((a, b) => relevanceScore(b) - relevanceScore(a));
    }
    list = sorted;
  }
  return list;
}

export function paginate<T>(list: T[], page: number) {
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  return { items: list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), page: current, pages, total: list.length };
}
