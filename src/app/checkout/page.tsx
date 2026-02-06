'use client';

import { useEffect, useMemo, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import type { MenuItem } from '@/types';

interface CartItemData {
  menuItem: MenuItem;
  quantity: number;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setItems(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.menuItem.price || 0) * item.quantity, 0),
    [items]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((item) => ({ menuItemId: item.menuItem.id, quantity: item.quantity })),
        contact: { name, email, phone },
        fulfillment,
      };
      const { data } = await api.post('/api/checkout', payload);
      localStorage.removeItem('cart');
      toast({ title: `Order placed! ID: ${data?.orderId || 'pending'}` });
      setItems([]);
    } catch (error) {
      toast({ title: 'Unable to place order. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Checkout</h1>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Contact Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="name">
                    Full Name
                  </label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="email">
                    Email
                  </label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="phone">
                    Phone
                  </label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Fulfillment</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillment('pickup')}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    fulfillment === 'pickup'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment('delivery')}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    fulfillment === 'delivery'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  Delivery
                </button>
              </div>
              <p className="mt-3 text-sm text-neutral-500">Payment will be collected at pickup or delivery.</p>
            </div>

            <div className="flex flex-col items-end gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-neutral-900">Total: {total.toFixed(2)}</p>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
