import Link from 'next/link';

/** Logo de Botillería Oasis (archivo en /public/logo.jpg, fondo blanco: va dentro de una pastilla blanca). */
export function LogoMark({ size = 38, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.jpg" alt="Botillería Oasis" style={{ height: size, width: 'auto' }} className={`rounded-lg bg-white object-contain ${className ?? ''}`} />
  );
}

export default function Logo({ size = 46 }: { tone?: 'light' | 'dark'; size?: number }) {
  return (
    <Link href="/" aria-label="Botillería Oasis — ir al inicio" className="inline-flex items-center">
      <span className="rounded-xl bg-white px-1.5 py-0.5 shadow-sm">
        <LogoMark size={size} className="rounded-none" />
      </span>
    </Link>
  );
}
