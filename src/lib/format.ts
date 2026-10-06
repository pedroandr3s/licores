const dots = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** $19.990 — formato manual para evitar diferencias de ICU entre servidor y navegador */
export const formatCLP = (n: number) => `$${dots(n)}`;
export const formatNumber = (n: number) => dots(n);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
