import { Baby, Brush, Cookie, CupSoda, Droplets, Headphones, PawPrint, Sofa, Sparkles, SprayCan, Tag, type LucideIcon } from 'lucide-react';

const map: Record<string, LucideIcon> = { SprayCan, Droplets, Sparkles, Sofa, Headphones, Cookie, CupSoda, PawPrint, Brush, Baby };

export default function CategoryIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Icon = map[name] ?? Tag;
  return <Icon size={size} className={className} />;
}
