import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  /** h1 cuando el estado vacío es el contenido principal de la página */
  headingLevel?: 'h1' | 'h2';
}

export default function EmptyState({ icon: Icon, title, description, children, headingLevel = 'h2' }: Props) {
  const Heading = headingLevel;
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon size={36} strokeWidth={1.75} />
      </span>
      <Heading className="mt-5 text-2xl font-extrabold">{title}</Heading>
      {description && <p className="mt-2 max-w-sm text-ink-500">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
