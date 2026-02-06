import { MenuCard } from '@/components/features/MenuCard';
import type { MenuItem } from '@/types';

interface FeaturedSectionProps {
  items: MenuItem[];
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900">Featured Picks</h2>
        <p className="text-sm text-neutral-500">Curated favorites from our baristas.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
