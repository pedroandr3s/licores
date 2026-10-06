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
    'Botillería Oasis en Quirihue (Avenida Prat 813): cervezas, vinos, destilados, licores, bebidas y papas fritas. Compra online y retira en el local. Venta solo a mayores de 18 años.',
  applicationName: SITE_NAME,
  keywords: ['botillería', 'licores', 'cervezas', 'vinos', 'pisco', 'papas fritas', 'Quirihue', 'Ñuble'],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_CL',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: 'Ofertas en cervezas, vinos y destilados. Retiro en tienda en Quirihue.',
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_TAGLINE },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a68a8',
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
