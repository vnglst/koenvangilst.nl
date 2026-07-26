import { useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';

import type { PhotoType } from '#/lib/photos';

type PhotoGalleryProps = {
  photos: PhotoType[];
};

type ViewTransitionAPI = {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

type PhotoTransitionDirection = 'left' | 'right' | 'up' | 'down';

const PHOTO_KEY_DIRECTIONS: Partial<Record<string, { delta: number; transition: PhotoTransitionDirection }>> = {
  ArrowDown: { delta: 1, transition: 'down' },
  ArrowUp: { delta: -1, transition: 'up' },
  ArrowRight: { delta: 1, transition: 'right' },
  ArrowLeft: { delta: -1, transition: 'left' }
};

function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function Photo({ photo, index, isActive }: { photo: PhotoType; index: number; isActive: boolean }) {
  return (
    <div
      id={`photo-${index}`}
      className={`relative h-screen w-full snap-start snap-always ${isActive ? 'photo-view-transition-target' : ''}`}
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
          <time dateTime={photo.createdAt} className="mt-1 block text-xs font-light text-white/70">
            {formatDate(photo.createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
}

export function FullScreenGallery({ photos, startIndex }: { photos: PhotoType[]; startIndex: number }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const transitionIdRef = useRef(0);
  const scrollIndicatorOffset = photos.length > 1 ? currentIndex * 100 : 0;

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: currentIndex * scrollContainer.clientHeight, behavior: 'auto' });
    }
  }, [currentIndex]);

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      navigate({ to: '/photography', search: {} });
      return;
    }

    const direction = PHOTO_KEY_DIRECTIONS[event.key];

    if (!direction) return;

    event.preventDefault();
    const nextIndex = currentIndex + direction.delta;

    if (nextIndex < 0 || nextIndex >= photos.length) return;

    const scrollToPhoto = (behavior: ScrollBehavior) => {
      const scrollContainer = scrollContainerRef.current ?? document.querySelector<HTMLDivElement>('.snap-y');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: nextIndex * scrollContainer.clientHeight, behavior });
      }
    };
    const commitPhoto = () => {
      flushSync(() => setCurrentIndex(nextIndex));
      scrollToPhoto('auto');
    };
    const startViewTransition = (document as ViewTransitionAPI).startViewTransition;

    if (!startViewTransition) {
      commitPhoto();
    } else {
      const transitionId = ++transitionIdRef.current;
      document.documentElement.dataset.photoTransition = direction.transition;
      const viewTransition = startViewTransition.call(document, commitPhoto);
      void viewTransition.finished
        .catch(() => {})
        .then(() => {
          if (transitionIdRef.current === transitionId) {
            delete document.documentElement.dataset.photoTransition;
          }
        });
    }

    void navigate({
      to: '/photography/$photo',
      params: { photo: String(photos[nextIndex].id) },
      resetScroll: false
    });
  });

  useLayoutEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950">
      <button
        onClick={() => navigate({ to: '/photography', search: {} })}
        className="photo-back-button fixed top-4 left-4 z-50 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm transition-opacity hover:opacity-60"
      >
        ← Back
      </button>
      <div ref={scrollContainerRef} className="photo-scroll-container h-screen snap-y snap-mandatory overflow-y-scroll">
        {photos.map((photo, index) => (
          <Photo key={photo.id} photo={photo} index={index} isActive={index === currentIndex} />
        ))}
      </div>
      <div
        aria-hidden="true"
        data-testid="photo-scroll-indicator"
        className="photo-scroll-indicator pointer-events-none fixed top-0 right-1 z-[60] h-screen w-1 rounded-full bg-white/20"
      >
        <div
          data-testid="photo-scroll-indicator-thumb"
          className="h-full w-full rounded-full bg-[#0a84ff] transition-none"
          style={{ height: `${100 / photos.length}%`, transform: `translateY(${scrollIndicatorOffset}%)` }}
        />
      </div>
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

  if (photos.length === 0) {
    return <PhotoGallerySkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          onClick={() => navigate({ to: '/photography/$photo', params: { photo: String(photo.id) } })}
          className="group relative block aspect-square overflow-hidden rounded-lg"
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
              className="h-full w-full transform-gpu object-cover transition-opacity transition-transform duration-300 ease-out group-hover:scale-115 group-hover:opacity-90"
              loading={index < 3 ? 'eager' : 'lazy'}
              fetchPriority={index < 3 ? 'high' : 'auto'}
            />
          </picture>
        </button>
      ))}
    </div>
  );
}
