import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import type { PhotoType } from '#/lib/photos';

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
      style={{
        backgroundColor: '#020617',
        backgroundImage: `url(${photo.blurDataURL})`,
        backgroundSize: 'cover'
      }}
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
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-8 pt-16 pb-12">
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
  const [slideOverlay, setSlideOverlay] = useState<{
    photo: PhotoType;
    direction: 'left' | 'right';
  } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = document.getElementById(`photo-${startIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'instant' });
    }
  }, [startIndex]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

      // Up/Down: keep existing smooth scroll behavior
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex = getCurrentPhotoIndex();
        const isNext = event.key === 'ArrowDown';
        const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= 0 && nextIndex < photos.length) {
          const element = document.getElementById(`photo-${nextIndex}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }

      // Left/Right: slide animation to prev/next photo
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();

        // Prevent overlapping transitions
        if (slideOverlay) return;

        const currentIndex = getCurrentPhotoIndex();
        const isNext = event.key === 'ArrowRight';
        const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= 0 && nextIndex < photos.length) {
          const direction = isNext ? 'right' : 'left';
          setSlideOverlay({
            photo: photos[nextIndex],
            direction
          });

          timeoutRef.current = setTimeout(() => {
            setSlideOverlay(null);
            const element = document.getElementById(`photo-${nextIndex}`);
            if (element) {
              element.scrollIntoView({ behavior: 'instant' });
            }
          }, 300);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, photos, photos.length, slideOverlay]);

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

      {slideOverlay && (
        <div
          className={`fixed inset-0 z-40 ${
            slideOverlay.direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          <Photo photo={slideOverlay.photo} index={-1} />
        </div>
      )}
    </div>
  );
}

function PhotoGallerySkeleton() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      ))}
    </div>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: '/photography/' });
  const photoParam = (search as Record<string, string | undefined>).photo;
  const selectedIndex = photoParam ? parseInt(photoParam, 10) : 0;

  if (photoParam !== undefined && photos.length > 0) {
    return <FullScreenGallery photos={photos} startIndex={selectedIndex} />;
  }

  if (photos.length === 0) {
    return <PhotoGallerySkeleton />;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          onClick={() => navigate({ to: '/photography', search: { photo: String(index) } })}
          className="relative block aspect-square overflow-hidden rounded-lg"
          style={{
            backgroundImage: `url(${photo.blurDataURL})`,
            backgroundSize: 'cover'
          }}
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
