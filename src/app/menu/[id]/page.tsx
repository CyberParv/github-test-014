import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { MenuItem } from '@/types';
import Link from 'next/link';

interface MenuItemPageProps {
  params: { id: string };
}

async function getMenuItem(id: string) {
  const { data } = await api.get(`/api/menu/${id}`);
  return data as MenuItem;
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  try {
    const item = await getMenuItem(params.id);
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'MenuItem',
      name: item.name,
      description: item.description,
      offers: {
        '@type': 'Offer',
        price: item.price,
        priceCurrency: item.currency || 'USD',
        availability: item.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    };

    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <Link href="/menu" className="text-sm text-neutral-500 hover:text-neutral-700">
            ← Back to menu
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={item.imageUrl || '/images/placeholder-coffee.jpg'}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-neutral-900">{item.name}</h1>
                <Badge>{item.available ? 'Available' : 'Unavailable'}</Badge>
              </div>
              <p className="text-sm text-neutral-600">{item.description}</p>
              <p className="text-2xl font-semibold text-neutral-900">
                {item.currency || 'USD'} {item.price?.toFixed(2)}
              </p>
              <Button className="w-full" disabled={!item.available}>
                Add to Cart
              </Button>
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Variants</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.variants?.length ? (
                    item.variants.map((variant, index) => (
                      <Badge key={index} variant="secondary">
                        {variant}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">No variants available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p>Unable to load this item.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/menu">Return to menu</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
}
