'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { PhotoType } from './getPhotos';

type PhotoGalleryProps = {
  photos: PhotoType[];
};

function Photo({ photo }: { photo: PhotoType }) {
  function formatDate(dateString?: Date) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <div className="relative h-screen w-full snap-start snap-always bg-slate-950">
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="100vw"
        alt={photo.alt}
        className="h-full w-full object-contain"
        loading="lazy"
      />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-8 pb-12 pt-16">
        <div className="text-center">
          <div className="text-base font-light tracking-wide text-white">{photo.location}</div>
          <div className="mt-1 text-xs font-light text-white/70">{formatDate(photo.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}

function FullScreenGallery({ photos }: { photos: PhotoType[] }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-slate-950">
      {/* Back button */}
      <button
        onClick={() => router.replace('/photography')}
        className="fixed top-4 left-4 z-50 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm transition-opacity hover:opacity-60"
      >
        ← Back
      </button>

      {/* Photo container */}
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {photos.map((photo) => (
          <Photo key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const photoParam = searchParams.get('photo');

  // Show full-screen gallery
  if (photoParam !== null) {
    return <FullScreenGallery photos={photos} />;
  }

  // Show grid overview
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <button key={photo.id} onClick={() => router.push(`/photography?photo=${index}`)} className="relative block aspect-square overflow-hidden rounded-lg">
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={photo.alt}
            className="h-full w-full object-cover transition-opacity hover:opacity-90"
            loading={index < 6 ? 'eager' : 'lazy'}
          />
        </button>
      ))}
    </div>
  );
}
