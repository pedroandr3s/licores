import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

interface TextProps extends BaseProps {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  maxLength?: number;
  prefix?: string;
  disabled?: boolean;
  optional?: boolean;
}

export function TextField({ id, label, error, hint, className, value, onChange, onBlur, type = 'text', placeholder, autoComplete, inputMode, maxLength, prefix, disabled, optional }: TextProps) {
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label} {optional && <span className="font-medium text-ink-400">(opcional)</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-0 top-0 grid h-11 place-items-center rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 px-3 text-[15px] font-semibold text-ink-500">{prefix}</span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn('input', error && 'input-error', prefix && 'pl-[64px]')}
        />
      </div>
      {error ? (
        <p id={`${id}-err`} className="field-error" role="alert">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface SelectProps extends BaseProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export function SelectField({ id, label, error, className, value, onChange, options, placeholder, disabled, autoComplete }: SelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">{label}</label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn('input appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2718%27 height=%2718%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236f6b8c%27 stroke-width=%272.2%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27><path d=%27m6 9 6 6 6-6%27/></svg>")] bg-[length:18px] bg-[right_12px_center] bg-no-repeat pr-10', error && 'input-error')}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function CheckField({ id, checked, onChange, children, error }: { id: string; checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[15px] text-ink-700">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 accent-brand-600" />
        <span>{children}</span>
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
