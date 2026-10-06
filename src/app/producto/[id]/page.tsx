import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { getProduct, getRelated, products } from '@/data/products';
import { categoryMap } from '@/data/categories';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: 'Producto no encontrado' };
  const description = `${p.name} de ${p.brand} a ${p.price.toLocaleString('es-CL')} pesos${p.discount ? ` (${p.discount}% de descuento)` : ''}. ${p.description.split('. ')[0]}.`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/producto/${p.id}` },
    openGraph: { type: 'website', title: `${p.name} | ${SITE_NAME}`, description, url: `/producto/${p.id}` },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    category: categoryMap[product.category].name,
    description: product.description,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/producto/${product.id}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={getRelated(product, 5)} />
    </>
  );
}
