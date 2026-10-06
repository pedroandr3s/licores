'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useStore } from '@/context/StoreContext';
import { DEMO_USER_NAME } from '@/lib/constants';
import Modal from './ui/Modal';
import { LogoMark } from './Logo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Record<string, string>;

export default function LoginModal() {
  const { loginOpen, loginMode, loginRedirect, closeLogin, openLogin, toast } = useUI();
  const { dispatch } = useStore();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', terms: false });

  useEffect(() => {
    if (loginOpen) {
      setMode(loginMode);
      setErrors({});
      setLoading(false);
    }
  }, [loginOpen, loginMode]);

  const set = (k: keyof typeof f, v: string | boolean) => {
    setF((s) => ({ ...s, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const finish = (name: string, email: string, points?: number) => {
    setLoading(true);
    window.setTimeout(() => {
      dispatch({ type: 'LOGIN', user: { name, email, lastName: name === DEMO_USER_NAME ? 'Soto' : undefined }, points });
      toast({ type: 'success', title: `¡Hola, ${name}!`, description: mode === 'register' ? 'Tu cuenta de demostración fue creada y te regalamos 800 puntos de bienvenida.' : 'Iniciaste sesión (simulado).' });
      setLoading(false);
      closeLogin();
      if (loginRedirect) router.push(loginRedirect);
    }, 650);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (mode === 'register' && f.name.trim().length < 2) er.name = 'Ingresa tu nombre';
    if (!EMAIL_RE.test(f.email.trim())) er.email = 'Ingresa un correo válido, por ejemplo nombre@correo.cl';
    if (mode === 'login' && f.password.length < 4) er.password = 'La contraseña debe tener al menos 4 caracteres';
    if (mode === 'register') {
      if (f.password.length < 6) er.password = 'Usa al menos 6 caracteres';
      if (f.confirm !== f.password) er.confirm = 'Las contraseñas no coinciden';
      if (!f.terms) er.terms = 'Debes aceptar los términos para crear tu cuenta';
    }
    setErrors(er);
    if (Object.keys(er).length) return;
    if (mode === 'login') finish(DEMO_USER_NAME, f.email.trim());
    else finish(f.name.trim().split(' ')[0], f.email.trim(), 800);
  };

  const demo = () => {
    setF((s) => ({ ...s, email: 'demo@oasis.cl', password: 'demo1234' }));
    setErrors({});
    finish(DEMO_USER_NAME, 'demo@oasis.cl');
  };

  return (
    <Modal open={loginOpen} onClose={closeLogin} hideHeader size="sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <LogoMark size={44} />
          <div>
            <h2 id="login-title" className="text-2xl font-extrabold leading-tight">
              {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
            </h2>
            <p className="text-sm text-ink-500">{mode === 'login' ? 'Accede a tus pedidos, favoritos y puntos.' : 'Suma puntos en cada compra.'}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-ink-100 p-1" role="tablist">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setErrors({}); openLogin(m, loginRedirect ?? undefined); }}
              className={`h-10 rounded-lg text-sm font-bold transition ${mode === m ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800'}`}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-5 space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="lg-name" className="label">Nombre</label>
              <input id="lg-name" data-autofocus className={`input ${errors.name ? 'input-error' : ''}`} value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="given-name" placeholder="Andrés" />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
          )}
          <div>
            <label htmlFor="lg-email" className="label">Email</label>
            <input id="lg-email" type="email" data-autofocus={mode === 'login' || undefined} className={`input ${errors.email ? 'input-error' : ''}`} value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="nombre@correo.cl" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="lg-pass" className="label">Contraseña</label>
            <div className="relative">
              <input id="lg-pass" type={showPass ? 'text' : 'password'} className={`input pr-11 ${errors.password ? 'input-error' : ''}`} value={f.password} onChange={(e) => set('password', e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass((s) => !s)} aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="lg-confirm" className="label">Repetir contraseña</label>
                <input id="lg-confirm" type={showPass ? 'text' : 'password'} className={`input ${errors.confirm ? 'input-error' : ''}`} value={f.confirm} onChange={(e) => set('confirm', e.target.value)} autoComplete="new-password" placeholder="••••••••" />
                {errors.confirm && <p className="field-error">{errors.confirm}</p>}
              </div>
              <div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-600">
                  <input type="checkbox" checked={f.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-0.5 h-[18px] w-[18px] rounded border-ink-300 accent-brand-600" />
                  <span>Acepto los términos y condiciones de esta demostración.</span>
                </label>
                {errors.terms && <p className="field-error">{errors.terms}</p>}
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading ? <><Loader2 size={20} className="animate-spin" /> Ingresando…</> : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold text-ink-400">
          <span className="h-px flex-1 bg-ink-100" /> o <span className="h-px flex-1 bg-ink-100" />
        </div>
        <button type="button" onClick={demo} disabled={loading} className="btn btn-sun w-full">
          <Sparkles size={18} /> Entrar con la cuenta demo
        </button>
        <p className="mt-4 text-center text-xs text-ink-500">Demostración: no hay autenticación real. Se acepta cualquier correo válido.</p>
      </div>
    </Modal>
  );
}
