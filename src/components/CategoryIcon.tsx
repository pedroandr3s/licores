import { Beer, Cookie, CupSoda, GlassWater, Martini, Tag, Wine, type LucideIcon } from 'lucide-react';

const map: Record<string, LucideIcon> = { Beer, Wine, GlassWater, Martini, CupSoda, Cookie };

export default function CategoryIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Icon = map[name] ?? Tag;
  return <Icon size={size} className={className} />;
}
