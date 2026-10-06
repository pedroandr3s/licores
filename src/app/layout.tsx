import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/figtree';
import '@fontsource-variable/bricolage-grotesque';
import './globals.css';
import Providers from '@/components/Providers';
import Header, { PromoBar } from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description:
    'MIXMARKET es una tienda online de demostración: perfumería, cuidado personal, limpieza, hogar, tecnología y más, con despacho a domicilio o retiro en tienda.',
  applicationName: SITE_NAME,
  keywords: ['tienda online', 'retail', 'ofertas', 'perfumería', 'tecnología', 'hogar', 'Chile'],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_CL',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: 'Ofertas de hasta 70% en miles de productos. Despacho a domicilio o retiro en tienda.',
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_TAGLINE },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6428e0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body>
        <Providers>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-bold">
            Saltar al contenido
          </a>
          <PromoBar />
          <Header />
          <main id="contenido" className="min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
