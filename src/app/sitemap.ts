import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { infoPages } from '@/data/content';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/productos', '/ofertas', '/nuevos', '/marcas', '/donde-encontrarnos', '/club', '/ayuda'];
  return [
    ...staticRoutes.map((r) => ({ url: `${SITE_URL}${r}`, changeFrequency: 'daily' as const, priority: r === '' ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${SITE_URL}/productos/${c.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/producto/${p.id}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...infoPages.map((p) => ({ url: `${SITE_URL}/ayuda/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.3 })),
  ];
}
