import Link from 'next/link';

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="11" fill="#ffcf3a" />
      <path d="M10 29 V13 L20 22.5 L30 13 V29" fill="none" stroke="#14122b" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32.5" cy="8.5" r="4.2" fill="#fb4b32" stroke="#ffcf3a" strokeWidth="2" />
    </svg>
  );
}

export default function Logo({ tone = 'light', size = 38 }: { tone?: 'light' | 'dark'; size?: number }) {
  return (
    <Link href="/" aria-label="MIXMARKET — ir al inicio" className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className={`font-display text-[22px] font-extrabold leading-none tracking-tight ${tone === 'light' ? 'text-white' : 'text-ink-900'}`}>
        MIXMARKET
      </span>
    </Link>
  );
}
