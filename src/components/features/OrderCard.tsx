import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <CardHeader className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-neutral-900">Order #{order.id}</h3>
          <Badge>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-0 pt-3">
        <p className="text-sm text-neutral-600">Total: {order.total?.toFixed(2)}</p>
        <p className="text-sm text-neutral-600">Fulfillment: {order.fulfillment}</p>
        <div className="space-y-1">
          {order.items?.map((item) => (
            <div key={item.menuItemId} className="flex justify-between text-sm text-neutral-700">
              <span>{item.menuItemId}</span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-0 pt-4">
        <p className="text-xs text-neutral-500">Placed {new Date(order.createdAt || '').toLocaleString()}</p>
      </CardFooter>
    </Card>
  );
}
