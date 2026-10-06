'use client';

import Link from 'next/link';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useUI, type ToastItem } from '@/context/UIContext';

const styles: Record<ToastItem['type'], { icon: typeof Info; box: string }> = {
  success: { icon: CheckCircle2, box: 'bg-mint-500 text-white' },
  info: { icon: Info, box: 'bg-brand-600 text-white' },
  error: { icon: TriangleAlert, box: 'bg-coral-500 text-white' },
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useUI();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[92px] z-[100] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:bottom-6 md:right-6 md:items-end md:px-0"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => {
        const S = styles[t.type];
        const Icon = S.icon;
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-[380px] animate-toast-in items-start gap-3 rounded-2xl border border-ink-100 bg-white p-3.5 shadow-pop"
          >
            <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${S.box}`}>
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold leading-snug text-ink-900">
                {t.type === 'success' ? '✓ ' : ''}
                {t.title}
              </p>
              {t.description && <p className="mt-0.5 line-clamp-1 text-sm text-ink-500">{t.description}</p>}
              {t.action &&
                (t.action.href ? (
                  <Link
                    href={t.action.href}
                    onClick={() => dismissToast(t.id)}
                    className="mt-2 inline-flex h-8 items-center rounded-lg bg-brand-600 px-3 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    {t.action.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      t.action?.onClick?.();
                      dismissToast(t.id);
                    }}
                    className="mt-2 inline-flex h-8 items-center rounded-lg bg-ink-100 px-3 text-sm font-bold text-ink-800 hover:bg-ink-200"
                  >
                    {t.action.label}
                  </button>
                ))}
            </div>
            <button type="button" aria-label="Cerrar aviso" onClick={() => dismissToast(t.id)} className="-mr-1 grid h-7 w-7 place-items-center rounded-full text-ink-400 hover:bg-ink-100">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
