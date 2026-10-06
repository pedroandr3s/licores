import { Check } from 'lucide-react';
import { cn } from '@/lib/format';

interface Props {
  steps: string[];
  current: number;
  onGo?: (i: number) => void;
}

export default function CheckoutSteps({ steps, current, onGo }: Props) {
  return (
    <ol className="flex items-center" aria-label="Pasos de la compra">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const clickable = done && onGo;
        const inner = (
          <>
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold transition-colors sm:h-9 sm:w-9',
                done && 'bg-mint-500 text-white',
                active && 'bg-brand-600 text-white ring-4 ring-brand-100',
                !done && !active && 'bg-ink-100 text-ink-400',
              )}
            >
              {done ? <Check size={17} strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('hidden text-[15px] font-bold sm:inline', active ? 'text-ink-900' : done ? 'text-ink-700' : 'text-ink-400')}>{label}</span>
          </>
        );
        return (
          <li key={label} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')} aria-current={active ? 'step' : undefined}>
            {clickable ? (
              <button type="button" onClick={() => onGo(i)} className="flex items-center gap-2.5 rounded-full hover:opacity-80" aria-label={`Volver al paso ${i + 1}: ${label}`}>
                {inner}
              </button>
            ) : (
              <span className="flex items-center gap-2.5">{inner}</span>
            )}
            {i < steps.length - 1 && <span aria-hidden className={cn('mx-2 h-0.5 flex-1 rounded-full sm:mx-3', done ? 'bg-mint-500' : 'bg-ink-100')} />}
          </li>
        );
      })}
    </ol>
  );
}
