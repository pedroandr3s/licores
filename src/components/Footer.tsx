'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, RotateCcw } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useStore } from '@/context/StoreContext';
import { STORAGE_KEY } from '@/lib/constants';
import Logo from './Logo';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './SocialIcons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function NewsletterBand() {
  const { toast } = useUI();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Ingresa un correo válido, por ejemplo nombre@correo.cl');
      return;
    }
    setError('');
    setEmail('');
    toast({ type: 'success', title: '¡Listo, te suscribiste!', description: 'Demostración: no se envió ningún correo.' });
  };
  return (
    <div className="bg-brand-700">
      <div className="container-page flex flex-col items-start justify-between gap-5 py-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun-400 text-ink-900"><Mail size={24} /></span>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">Ofertas antes que nadie</h2>
            <p className="text-brand-100">Suscríbete y recibe descuentos exclusivos del Club Oasis.</p>
          </div>
        </div>
        <form onSubmit={submit} noValidate className="w-full md:max-w-md">
          <div className="flex gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Tu correo</label>
            <input id="newsletter-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="tu@correo.cl" className={`h-12 min-w-0 flex-1 rounded-xl border-2 bg-white px-4 text-ink-900 outline-none placeholder:text-ink-400 focus:border-sun-400 ${error ? 'border-coral-400' : 'border-transparent'}`} />
            <button type="submit" className="btn btn-sun h-12 shrink-0 px-5">Suscribirme</button>
          </div>
          {error && <p className="mt-1.5 text-sm font-semibold text-sun-200">{error}</p>}
        </form>
      </div>
    </div>
  );
}

const cols: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Nosotros',
    links: [
      { href: '/ayuda/quienes-somos', label: 'Quiénes somos' },
      { href: '/ayuda/trabaja-con-nosotros', label: 'Trabaja con nosotros' },
      { href: '/donde-encontrarnos', label: 'Dónde encontrarnos' },
      { href: '/club', label: 'Club Oasis' },
    ],
  },
  {
    title: 'Servicio al cliente',
    links: [
      { href: '/ayuda/contacto', label: 'Contacto' },
      { href: '/ayuda', label: 'Preguntas frecuentes' },
      { href: '/ayuda/terminos-y-condiciones', label: 'Términos y condiciones' },
      { href: '/ayuda/politicas-de-retiro', label: 'Políticas de retiro' },
      { href: '/ayuda/cambios-y-devoluciones', label: 'Cambios y devoluciones' },
    ],
  },
  {
    title: 'Mi cuenta',
    links: [
      { href: '/mis-pedidos', label: 'Mis pedidos' },
      { href: '/favoritos', label: 'Favoritos' },
      { href: '/cuenta', label: 'Mi perfil' },
    ],
  },
];

export default function Footer() {
  const { toast } = useUI();
  const { dispatch } = useStore();

  const social = (name: string) =>
    toast({ type: 'info', title: `${name} de Oasis`, description: 'Demostración: la red social es ficticia.' });

  const reset = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    dispatch({ type: 'RESET' });
    toast({ type: 'success', title: 'Demo restablecida', description: 'Carrito, favoritos, sesión y pedidos volvieron al estado inicial.' });
  };

  return (
    <footer className="mt-16 bg-ink-900 text-ink-200">
      <NewsletterBand />
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-ink-300">Licores, bebidas y picoteo para tu junta. Un solo local en Quirihue: compra online y retira sin filas.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Visa', 'Mastercard', 'Webpay', 'Transferencia', 'Pago en tienda'].map((m) => (
              <span key={m} className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-ink-200">{m}</span>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="font-display text-base font-extrabold text-white">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-ink-300 transition hover:text-white hover:underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="font-display text-base font-extrabold text-white">Síguenos</h3>
          <ul className="mt-4 flex gap-2.5">
            {[
              { name: 'Instagram', icon: <InstagramIcon /> },
              { name: 'Facebook', icon: <FacebookIcon /> },
              { name: 'TikTok', icon: <TikTokIcon /> },
            ].map((s) => (
              <li key={s.name}>
                <button type="button" aria-label={s.name} onClick={() => social(s.name)} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-brand-500">
                  {s.icon}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-400">Avenida Prat 813, Quirihue. Solo retiro en tienda.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-5 text-sm text-ink-400 md:flex-row md:items-center">
          <div>
            <p>© 2026 Oasis. Sitio de demostración: todos los productos, precios, el local y los pedidos son ficticios.</p>
            <p className="mt-1 font-semibold text-ink-300">Prohibida la venta de alcohol a menores de 18 años. El exceso de alcohol es dañino: toma con responsabilidad.</p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 font-semibold text-ink-300 hover:text-white">
            <RotateCcw size={14} /> Restablecer demo
          </button>
        </div>
      </div>
    </footer>
  );
}
