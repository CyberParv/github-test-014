'use client';

import { useEffect, useMemo, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { CartItem, CartLineItem } from '@/components/features/CartItem';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/providers/ToastProvider';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setItems(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.menuItem.price || 0) * item.quantity, 0),
    [items]
  );

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const next = [...prev];
      const target = next[index];
      const qty = target.quantity + delta;
      if (qty <= 0) return prev;
      next[index] = { ...target, quantity: qty };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
    toast({ title: 'Item removed from cart.' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-neutral-900">Your Cart</h1>
          <Button asChild variant="outline">
            <Link href="/menu">Continue Shopping</Link>
          </Button>
        </header>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
            <p>Your cart is empty. Add something delicious.</p>
            <Button asChild className="mt-4">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {items.map((item, index) => (
              <CartItem
                key={`${item.menuItem.id}-${index}`}
                item={item}
                onIncrease={() => updateQuantity(index, 1)}
                onDecrease={() => updateQuantity(index, -1)}
                onRemove={() => removeItem(index)}
              />
            ))}
            <div className="flex flex-col items-end gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-neutral-900">Total: {total.toFixed(2)}</p>
              <Button asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
