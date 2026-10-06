import type { Product } from '@/types';
import { products } from '@/data/products';
import { categoryMap } from '@/data/categories';

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

interface Indexed {
  product: Product;
  name: string;
  brand: string;
  tags: string[];
  cat: string;
  blob: string;
}

let index: Indexed[] | null = null;

function getIndex(): Indexed[] {
  if (!index) {
    index = products.map((p) => {
      const cat = normalize(`${categoryMap[p.category].name} ${p.subcategory}`);
      const name = normalize(p.name);
      const brand = normalize(p.brand);
      const tags = p.tags.map(normalize);
      return {
        product: p,
        name,
        brand,
        tags,
        cat,
        blob: `${name} ${brand} ${tags.join(' ')} ${cat} ${normalize(p.description)}`,
      };
    });
  }
  return index;
}

function variants(token: string): string[] {
  const out = [token];
  if (token.length > 3 && token.endsWith('es')) out.push(token.slice(0, -2));
  if (token.length > 3 && token.endsWith('s')) out.push(token.slice(0, -1));
  return out;
}

/** Búsqueda simple por tokens (AND), insensible a tildes y mayúsculas, con puntaje. */
export function searchProducts(query: string, list?: Product[]): Product[] {
  const q = normalize(query);
  if (!q) return list ?? products;
  const tokens = q.split(/\s+/).filter(Boolean);
  const allowed = list ? new Set(list.map((p) => p.id)) : null;
  const scored: Array<{ p: Product; score: number }> = [];
  for (const it of getIndex()) {
    if (allowed && !allowed.has(it.product.id)) continue;
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      const vs = variants(t);
      if (!vs.some((v) => it.blob.includes(v))) {
        ok = false;
        break;
      }
      for (const v of vs) {
        if (it.name.split(' ').some((w) => w.startsWith(v))) score += 6;
        else if (it.name.includes(v)) score += 4;
        if (it.brand.includes(v)) score += 3;
        if (it.tags.includes(v)) score += 4;
        else if (it.tags.some((g) => g.includes(v))) score += 2;
        if (it.cat.includes(v)) score += 2;
        if (it.blob.includes(v)) score += 1;
      }
    }
    if (ok) scored.push({ p: it.product, score: score + (it.product.featured ? 2 : 0) });
  }
  return scored.sort((a, b) => b.score - a.score || b.p.sold - a.p.sold).map((s) => s.p);
}

export const POPULAR_SEARCHES = ['shampoo', 'perfume', 'detergente', 'audífonos', 'pañales', 'café'];
