export const cleanRut = (rut: string) => rut.replace(/[^0-9kK]/g, '').toUpperCase();

export function formatRut(rut: string) {
  const c = cleanRut(rut);
  if (c.length < 2) return c;
  const body = c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${c.slice(-1)}`;
}

export function rutDV(body: string) {
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const r = 11 - (sum % 11);
  return r === 11 ? '0' : r === 10 ? 'K' : String(r);
}

export function validateRut(rut: string) {
  const c = cleanRut(rut);
  if (c.length < 8 || c.length > 9) return false;
  const body = c.slice(0, -1);
  if (!/^\d+$/.test(body)) return false;
  return rutDV(body) === c.slice(-1);
}
