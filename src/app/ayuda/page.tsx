import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown, Package, RotateCcw, Truck, MessageCircle } from 'lucide-react';
import { faqs } from '@/data/content';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Ayuda y preguntas frecuentes',
  description: 'Resuelve tus dudas sobre compras, despacho, retiro en tienda, pagos, cambios y devoluciones en MIXMARKET.',
  alternates: { canonical: '/ayuda' },
};

const quick = [
  { href: '/mis-pedidos', icon: Package, title: 'Seguir mi pedido', text: 'Revisa el estado de tus compras.' },
  { href: '/ayuda/politicas-de-despacho', icon: Truck, title: 'Despacho y retiro', text: 'Costos, plazos y cobertura.' },
  { href: '/ayuda/cambios-y-devoluciones', icon: RotateCcw, title: 'Cambios y devoluciones', text: '30 días para cambiar tu producto.' },
  { href: '/ayuda/contacto', icon: MessageCircle, title: 'Contacto', text: 'Escríbenos o visítanos en tienda.' },
];

export default function AyudaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <div className="container-page py-5 md:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Ayuda' }]} />
      <h1 className="mt-4 text-[30px] font-extrabold md:text-5xl">¿En qué podemos ayudarte?</h1>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map((q) => (
          <li key={q.href}>
            <Link href={q.href} className="card flex h-full items-start gap-3.5 p-5 transition-shadow hover:shadow-lift">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><q.icon size={22} /></span>
              <span><span className="block font-extrabold">{q.title}</span><span className="text-sm text-ink-500">{q.text}</span></span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 max-w-3xl" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-extrabold md:text-[30px]">Preguntas frecuentes</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown size={20} className="shrink-0 text-ink-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-ink-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
