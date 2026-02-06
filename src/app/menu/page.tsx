import { Navigation } from '@/components/layout/Navigation';
import { MenuCard } from '@/components/features/MenuCard';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { MenuItem, Category } from '@/types';
import Link from 'next/link';

interface MenuPageProps {
  searchParams?: { category?: string; q?: string };
}

async function getMenu(category?: string, q?: string) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (q) params.append('q', q);
  const { data } = await api.get(`/api/menu?${params.toString()}`);
  return data as { items: MenuItem[]; total: number };
}

async function getCategories() {
  const { data } = await api.get('/api/categories');
  return data?.categories as Category[];
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  try {
    const [menuData, categories] = await Promise.all([
      getMenu(searchParams?.category, searchParams?.q),
      getCategories(),
    ]);

    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">Menu</h1>
              <p className="text-sm text-neutral-600">Browse handcrafted drinks and fresh bites.</p>
            </div>
            <Button asChild>
              <Link href="/cart">View Cart</Link>
            </Button>
          </header>

          <section className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-300 hover:text-neutral-900"
            >
              All
            </Link>
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/menu?category=${category.id}`}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-300 hover:text-neutral-900"
              >
                {category.name}
              </Link>
            ))}
          </section>

          {menuData.items.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
              <p>No items found. Try a different category.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuData.items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p>Unable to load menu. Please try again.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/menu">Retry</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
}
