import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <CardContent className="space-y-2 p-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-900">Rating</p>
          <Badge>{review.rating}/5</Badge>
        </div>
        <p className="text-sm text-neutral-700">{review.comment}</p>
        <p className="text-xs text-neutral-500">{new Date(review.createdAt || '').toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}
