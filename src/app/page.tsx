import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/features/HeroSection';
import { FeaturedSection } from '@/components/features/FeaturedSection';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { MenuItem } from '@/types';
import Link from 'next/link';

async function getFeatured() {
  try {
    const { data } = await api.get('/api/featured');
    return (data?.items || []) as MenuItem[];
  } catch (error) {
    return null;
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <HeroSection />
        <section className="rounded-2xl bg-neutral-900 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Autumn Harvest Latte</h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-200">
                A seasonal blend of cinnamon, maple, and espresso. Available for a limited time.
              </p>
            </div>
            <Button asChild className="bg-white text-neutral-900 hover:bg-neutral-100">
              <Link href="/menu">Order Now</Link>
            </Button>
          </div>
        </section>
        {featured === null ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="text-sm">Unable to load featured items. Please refresh.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/">Retry</Link>
            </Button>
          </section>
        ) : featured.length === 0 ? (
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
            <p className="text-sm">No featured items right now. Check back soon.</p>
          </section>
        ) : (
          <FeaturedSection items={featured} />
        )}
        <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-sm lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-neutral-900">Order ahead, skip the line.</h3>
            <p className="text-sm text-neutral-600">
              Build your perfect drink and pastries, then pick up when it suits you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild>
              <Link href="/cart">Start Order</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
