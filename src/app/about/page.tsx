import { Navigation } from '@/components/layout/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-900">About Our Coffee House</h1>
        <p className="mt-4 text-sm text-neutral-600">
          We are a neighborhood coffee shop dedicated to craft, community, and warmth. Our beans are
          sourced responsibly and roasted in small batches to highlight unique flavor notes.
        </p>
        <section className="mt-8 grid gap-6 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Location</h2>
            <p className="mt-2 text-sm text-neutral-600">123 Brew Lane, Coffee City</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Hours</h2>
            <p className="mt-2 text-sm text-neutral-600">Mon - Fri: 7am - 6pm</p>
            <p className="text-sm text-neutral-600">Sat - Sun: 8am - 5pm</p>
          </div>
        </section>
      </main>
    </div>
  );
}
