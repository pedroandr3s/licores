export function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.5-3.1h-3.1V8.6c0-.9.4-1.6 1.7-1.6h1.5V4.3c-.3 0-1.3-.2-2.4-.2-2.5 0-4 1.5-4 4.1v2.2H7.7v3.1h2.6V21h3.2z" />
    </svg>
  );
}

export function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 3c.3 2.4 1.7 3.9 4 4.1v3c-1.4.1-2.7-.3-4-1.1v5.9c0 3.7-2.6 5.9-5.6 5.9-3 0-5.4-2.3-5.4-5.3 0-3.3 2.7-5.6 6-5.2v3.1c-1.6-.5-3 .5-3 2.1 0 1.2.9 2.2 2.1 2.2 1.4 0 2.2-1 2.2-2.6V3h3.7z" />
    </svg>
  );
}
