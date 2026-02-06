import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white">
      <div className="absolute inset-0 opacity-30">
        <img src="/images/hero-coffee.jpg" alt="Coffee shop ambiance" className="h-full w-full object-cover" />
      </div>
      <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-200">Brewed fresh daily</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Handcrafted coffee and pastries that feel like home.
        </h1>
        <p className="mt-4 max-w-xl text-base text-neutral-200">
          Explore seasonal blends, signature lattes, and handcrafted bites. Order ahead for pickup or
          book your table in seconds.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild className="bg-white text-neutral-900 hover:bg-neutral-100">
            <Link href="/menu">Explore Menu</Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="/reservations">Reserve a Table</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
