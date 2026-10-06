import { Star } from 'lucide-react';

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const row = (cls: string) => (
    <div className={`flex ${cls}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="shrink-0 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
  return (
    <span className="relative inline-flex" role="img" aria-label={`Valoración ${rating} de 5`}>
      {row('text-ink-200')}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(rating / 5) * 100}%` }}>
        {row('text-sun-500')}
      </span>
    </span>
  );
}

export default function Rating({ rating, reviews, size = 14 }: { rating: number; reviews?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-500">
      <Stars rating={rating} size={size} />
      <span className="font-bold text-ink-700">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews.toLocaleString('es-CL')})</span>}
    </span>
  );
}
