import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  className?: string;
}

export function MenuCard({ item, className }: MenuCardProps) {
  return (
    <Card className={cn('flex flex-col h-full overflow-hidden', className)}>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <img
            src={item.imageUrl || '/images/placeholder-coffee.jpg'}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-neutral-900">{item.name}</h3>
          {item.available === false ? (
            <Badge variant="secondary">Unavailable</Badge>
          ) : (
            <Badge>Available</Badge>
          )}
        </div>
        <p className="text-sm text-neutral-600 line-clamp-2">{item.description}</p>
        <p className="text-base font-semibold text-neutral-900">
          {item.currency || 'USD'} {item.price?.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild className="w-full">
          <Link href={`/menu/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
