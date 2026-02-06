import { Navigation } from '@/components/layout/Navigation';

const photos = Array.from({ length: 9 }).map((_, index) => `/images/gallery-${index + 1}.jpg`);

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Gallery</h1>
        <p className="mt-2 text-sm text-neutral-600">A glimpse into our daily craft and community.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((src, index) => (
            <div key={src} className="overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={src}
                alt={`Coffee shop gallery ${index + 1}`}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
