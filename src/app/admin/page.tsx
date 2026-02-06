'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import Link from 'next/link';

interface SummaryData {
  salesTotal: number;
  orders: number;
  topItems: { menuItemId: string; sold: number }[];
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/stats');
      setSummary(data);
    } catch (err) {
      setError('Unable to load stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-neutral-900">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/menu">Manage Menu</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p>{error}</p>
            <Button onClick={loadSummary} className="mt-4">
              Retry
            </Button>
          </div>
        ) : summary ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-neutral-500">Sales Total</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">{summary.salesTotal.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-neutral-500">Orders</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">{summary.orders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-neutral-500">Top Items</p>
                <div className="mt-3 space-y-2 text-sm text-neutral-700">
                  {summary.topItems?.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between">
                      <span>{item.menuItemId}</span>
                      <span>{item.sold}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
            <p>No summary available.</p>
          </div>
        )}
      </main>
    </div>
  );
}
