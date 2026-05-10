import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import type { PhotoType } from '#/data/photos';

type PhotoGalleryProps = {
  photos: PhotoType[];
};

function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function Photo({ photo, index }: { photo: PhotoType; index: number }) {
  return (
    <div
      id={`photo-${index}`}
      className="relative h-screen w-full snap-start snap-always"
      style={{ backgroundColor: '#020617', backgroundImage: `url(${photo.blurDataURL})`, backgroundSize: 'cover' }}
    >
      <picture>
        {photo.srcSetWebp && <source type="image/webp" srcSet={photo.srcSetWebp} sizes="100vw" />}
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="100vw"
          alt={photo.alt}
          className="h-full w-full object-contain"
          loading={index < 2 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
        />
      </picture>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-8 pb-12 pt-16">
        <div className="text-center">
          <div className="text-base font-light tracking-wide text-white">{photo.location}</div>
          <div className="mt-1 text-xs font-light text-white/70">{formatDate(photo.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}

function FullScreenGallery({ photos, startIndex }: { photos: PhotoType[]; startIndex: number }) {
  const navigate = useNavigate();

  useEffect(() => {
    const element = document.getElementById(`photo-${startIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'instant' });
    }
  }, [startIndex]);

  useEffect(() => {
    function getCurrentPhotoIndex() {
      const scrollContainer = document.querySelector('.snap-y');
      if (!scrollContainer) return 0;
      const scrollTop = scrollContainer.scrollTop;
      const photoHeight = window.innerHeight;
      return Math.round(scrollTop / photoHeight);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        navigate({ to: '/photography', search: {} });
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex = getCurrentPhotoIndex();
        const nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= 0 && nextIndex < photos.length) {
          const element = document.getElementById(`photo-${nextIndex}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, photos.length]);

  return (
    <div className="fixed inset-0 bg-slate-950">
      <button
        onClick={() => navigate({ to: '/photography', search: {} })}
        className="fixed top-4 left-4 z-50 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm transition-opacity hover:opacity-60"
      >
        ← Back
      </button>
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {photos.map((photo, index) => (
          <Photo key={photo.id} photo={photo} index={index} />
        ))}
      </div>
    </div>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: '/photography/' });
  const photoParam = (search as Record<string, string | undefined>).photo;
  const selectedIndex = photoParam ? parseInt(photoParam, 10) : 0;

  if (photoParam !== undefined) {
    return <FullScreenGallery photos={photos} startIndex={selectedIndex} />;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          onClick={() => navigate({ to: '/photography', search: { photo: String(index) } })}
          className="relative block aspect-square overflow-hidden rounded-lg"
          style={{ backgroundImage: `url(${photo.blurDataURL})`, backgroundSize: 'cover' }}
        >
          <picture>
            {photo.srcSetWebp && (
              <source
                type="image/webp"
                srcSet={photo.srcSetWebp}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={photo.alt}
              className="h-full w-full object-cover transition-opacity hover:opacity-90"
              loading={index < 6 ? 'eager' : 'lazy'}
              fetchPriority={index < 3 ? 'high' : 'auto'}
            />
          </picture>
        </button>
      ))}
    </div>
  );
}
