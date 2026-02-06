'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { MenuItem } from '@/types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/menu');
      setItems(data?.items || []);
    } catch (err) {
      setError('Unable to load menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/api/menu', {
        name,
        price: Number(price),
      });
      setOpen(false);
      setName('');
      setPrice('');
      loadItems();
    } catch (error) {
      setError('Unable to create item.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/menu/${id}`);
      loadItems();
    } catch (error) {
      setError('Unable to delete item.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-neutral-900">Menu Management</h1>
          <Button onClick={() => setOpen(true)}>Add Item</Button>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p>{error}</p>
            <Button onClick={loadItems} className="mt-4">
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
            <p>No menu items yet.</p>
          </div>
        ) : (
          <div className="mt-8 divide-y divide-neutral-200 rounded-2xl bg-white shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-base font-semibold text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-500">{item.currency || 'USD'} {item.price?.toFixed(2)}</p>
                </div>
                <Button variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Menu Item">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="item-name">
              Name
            </label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="item-price">
              Price
            </label>
            <Input id="item-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
