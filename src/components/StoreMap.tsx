'use client';

import { ExternalLink } from 'lucide-react';
import { store } from '@/data/stores';
import { MAPS_URL } from '@/lib/constants';
import { cn } from '@/lib/format';

const EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(`${store.address}, Chile`)}&z=17&hl=es&output=embed`;

/** Mapa interactivo de Google Maps (sin API key) con la ubicación del local. */
export default function StoreMap({ className }: { className?: string }) {
  return (
    <div className={cn('relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-100 bg-ink-50 shadow-card', className)}>
      <iframe
        title={`Mapa de ${store.name}: ${store.address}`}
        src={EMBED_URL}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow-md hover:bg-brand-50"
      >
        Abrir en Google Maps <ExternalLink size={13} />
      </a>
    </div>
  );
}
