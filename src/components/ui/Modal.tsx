'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useOverlay } from '@/hooks/useOverlay';
import { cn } from '@/lib/format';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hideHeader?: boolean;
}

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

export default function Modal({ open, onClose, title, description, children, size = 'md', hideHeader }: Props) {
  const ref = useOverlay(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
      <div className="absolute inset-0 animate-fade-in bg-ink-900/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92dvh] w-full animate-slide-in-up flex-col overflow-hidden rounded-t-3xl bg-white shadow-pop outline-none sm:animate-pop-in sm:rounded-3xl',
          sizes[size],
        )}
      >
        {!hideHeader && (
          <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4 sm:px-6">
            <div>
              {title && <h2 className="text-xl font-extrabold text-ink-900">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="-mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900">
              <X size={20} />
            </button>
          </div>
        )}
        {hideHeader && (
          <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-500 hover:bg-ink-100 hover:text-ink-900">
            <X size={20} />
          </button>
        )}
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
