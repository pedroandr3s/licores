const DAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const DAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const pad = (n: number) => String(n).padStart(2, '0');

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};

export function addDays(from: Date, n: number): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

export const formatDateShort = (d: Date) => `${DAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
export const formatDateLong = (d: Date) =>
  `${DAYS_LONG[d.getDay()]} ${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
export const formatDayMonth = (d: Date) => `${d.getDate()} de ${MONTHS_LONG[d.getMonth()]}`;
export const formatISOShort = (iso: string) => formatDateShort(parseISODate(iso));
export const formatISOLong = (iso: string) => formatDateLong(parseISODate(iso));

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export interface DateOption {
  iso: string;
  label: string;
  hint: string;
}

/** Fechas para elegir el retiro en tienda: hoy (listo en 1 hora) y los días siguientes. */
export function getDateOptions(now = new Date(), count = 4): DateOption[] {
  const out: DateOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = addDays(now, i);
    out.push({ iso: toISODate(d), label: i === 0 ? 'Hoy' : formatDateShort(d), hint: i === 0 ? 'Listo en 1 hora' : 'Desde las 11:00' });
  }
  return out;
}
