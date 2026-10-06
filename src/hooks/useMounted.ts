'use client';

import { useEffect, useState } from 'react';

/** true recién después de montar en el cliente (útil para datos que dependen de la fecha/hora actual). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Simula una carga breve cada vez que cambia `key` (para mostrar skeletons). */
export function useSimulatedLoading(key: string, ms = 450) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [key, ms]);
  return loading;
}
