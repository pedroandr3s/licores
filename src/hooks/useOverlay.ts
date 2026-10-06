'use client';

import { useEffect, useRef } from 'react';

let locks = 0;

/** Bloquea el scroll del body, cierra con Escape y devuelve el foco al elemento anterior. */
export function useOverlay(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    locks += 1;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const el = panelRef.current;
      if (!el) return;
      const target = el.querySelector<HTMLElement>('[data-autofocus]') ?? el;
      target.focus({ preventScroll: true });
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      locks = Math.max(0, locks - 1);
      if (locks === 0) document.body.style.overflow = '';
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return panelRef;
}
