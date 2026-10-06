import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInfoPage, infoPages } from '@/data/content';
import Breadcrumbs from '@/components/Breadcrumbs';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) return { title: 'Página no encontrada' };
  return { title: page.title, description: page.description, alternates: { canonical: `/ayuda/${page.slug}` } };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();

  return (
    <div className="container-page py-5 md:py-8">
      <Breadcrumbs items={[{ label: 'Ayuda', href: '/ayuda' }, { label: page.title }]} />
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav className="card p-2 lg:sticky lg:top-[152px]" aria-label="Más información">
          <ul>
            {infoPages.map((p) => (
              <li key={p.slug}>
                <Link href={`/ayuda/${p.slug}`} aria-current={p.slug === page.slug ? 'page' : undefined} className={`block rounded-xl px-4 py-2.5 text-[15px] font-bold ${p.slug === page.slug ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'}`}>
                  {p.title}
                </Link>
              </li>
            ))}
            <li><Link href="/ayuda" className="block rounded-xl px-4 py-2.5 text-[15px] font-bold text-ink-600 hover:bg-ink-50">Preguntas frecuentes</Link></li>
          </ul>
        </nav>
        <article className="card max-w-3xl p-6 sm:p-9">
          <h1 className="text-[30px] font-extrabold leading-tight md:text-4xl">{page.title}</h1>
          <div className="mt-6 space-y-7">
            {page.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-extrabold">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-ink-700">{s.body}</p>
              </section>
            ))}
          </div>
          <p className="mt-8 border-t border-ink-100 pt-5 text-sm text-ink-500">Sitio de demostración: la información es ficticia.</p>
        </article>
      </div>
    </div>
  );
}
