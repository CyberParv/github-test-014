'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types';

export interface CartLineItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartItemProps {
  item: CartLineItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  className?: string;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove, className }: CartItemProps) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center', className)}>
      <img
        src={item.menuItem.imageUrl || '/images/placeholder-coffee.jpg'}
        alt={item.menuItem.name}
        className="h-20 w-20 rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="text-base font-semibold text-neutral-900">{item.menuItem.name}</h4>
        <p className="text-sm text-neutral-600">
          {item.menuItem.currency || 'USD'} {item.menuItem.price?.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onDecrease} aria-label="Decrease quantity">
          -
        </Button>
        <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
        <Button variant="outline" size="sm" onClick={onIncrease} aria-label="Increase quantity">
          +
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700">
        Remove
      </Button>
    </div>
  );
}
