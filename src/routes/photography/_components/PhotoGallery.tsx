import { useCallback, useEffectEvent, useLayoutEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { PhotoType } from '#/lib/photos';
import { Button } from '#/components/ui/Button';
import { GalleryNavigation } from '#/components/ui/GalleryNavigation';
import { Text } from '#/components/ui/Text';
import { Heading } from '#/components/content/Heading';

type PhotoGalleryProps = { photos: PhotoType[] };
type ViewTransitionAPI = { startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> } };
const PHOTO_KEY_DIRECTIONS: Partial<Record<string, { delta: number; transition: string }>> = {
  ArrowDown: { delta: 1, transition: 'down' },
  ArrowUp: { delta: -1, transition: 'up' },
  ArrowRight: { delta: 1, transition: 'right' },
  ArrowLeft: { delta: -1, transition: 'left' }
};

export function FullScreenGallery({ photos, startIndex }: { photos: PhotoType[]; startIndex: number }) {
  const navigate = useNavigate();
  const transitionId = useRef(0);
  const selectedIndex = useRef(startIndex);
  useLayoutEffect(() => {
    selectedIndex.current = startIndex;
  }, [startIndex]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[startIndex];
  const changePhoto = useCallback(
    async (key: string) => {
      if (key === 'Escape') {
        await navigate({ to: '/photography', search: {} });
        return;
      }
      const direction = PHOTO_KEY_DIRECTIONS[key];
      if (!direction) return;
      const next = selectedIndex.current + direction.delta;
      if (next < 0 || next >= photos.length) return;
      selectedIndex.current = next;
      const currentTransition = ++transitionId.current;
      const update = async () => {
        await navigate({ to: '/photography/$photo', params: { photo: String(photos[next].id) }, resetScroll: false });
      };
      try {
        const startTransition = (document as ViewTransitionAPI).startViewTransition;
        if (startTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          document.documentElement.dataset.photoTransition = direction.transition;
          const transition = startTransition.call(document, update);
          await transition.finished.catch(() => {});
        } else {
          await update();
        }
      } finally {
        if (currentTransition === transitionId.current) delete document.documentElement.dataset.photoTransition;
      }
    },
    [navigate, photos]
  );
  const handlePhotoKey = useEffectEvent((key: string) => {
    void changePhoto(key);
  });
  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key in PHOTO_KEY_DIRECTIONS || event.key === 'Escape') {
        event.preventDefault();
        handlePhotoKey(event.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <main id="content" className="photo-viewer" aria-label="Photograph viewer">
      <div className="photo-viewer-toolbar">
        <Button
          variant="bare"
          className="photo-back-button"
          onClick={() => navigate({ to: '/photography', search: {} })}
        >
          ← Back
        </Button>
        <span className="photo-counter">
          {startIndex + 1} / {photos.length}
        </span>
      </div>
      <figure
        className="photo-slide photo-view-transition-target"
        onTouchStart={(event) => {
          touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const x = event.changedTouches[0].clientX - start.x;
          const y = event.changedTouches[0].clientY - start.y;
          if (Math.abs(x) > 60 && Math.abs(x) > Math.abs(y)) void changePhoto(x < 0 ? 'ArrowRight' : 'ArrowLeft');
        }}
      >
        <picture key={photo.id}>
          {photo.srcSetWebp && <source type="image/webp" srcSet={photo.srcSetWebp} sizes="100vw" />}
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="100vw"
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            fetchPriority="high"
          />
        </picture>
        <figcaption className="photo-caption" aria-live="polite">
          <div className="photo-location">{photo.location}</div>
          {photo.createdAt && (
            <time dateTime={photo.createdAt} className="mt-1 block">
              {new Date(photo.createdAt).toLocaleDateString('en-US', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          )}
        </figcaption>
      </figure>
      <GalleryNavigation
        immersive
        label="Photograph navigation"
        previousLabel="Previous photograph"
        nextLabel="Next photograph"
        previousDisabled={startIndex === 0}
        nextDisabled={startIndex === photos.length - 1}
        onPrevious={() => void changePhoto('ArrowLeft')}
        onNext={() => void changePhoto('ArrowRight')}
      />
    </main>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const navigate = useNavigate();

  if (photos.length === 0) {
    return (
      <>
        <Heading>Photography</Heading>
        <Text role="status" tone="muted">
          Photography is temporarily unavailable. Please try again later.
        </Text>
      </>
    );
  }

  return (
    <>
      <Heading>Photography</Heading>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <Button
            variant="bare"
            key={photo.id}
            onClick={() => navigate({ to: '/photography/$photo', params: { photo: String(photo.id) } })}
            className="group"
          >
            <figure>
              <picture>
                {photo.srcSetWebp && (
                  <source
                    type="image/webp"
                    srcSet={photo.srcSetWebp}
                    sizes={index % 2 === 0 ? '(max-width: 767px) 100vw, 58vw' : '(max-width: 767px) 100vw, 42vw'}
                  />
                )}
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes={index % 2 === 0 ? '(max-width: 767px) 100vw, 58vw' : '(max-width: 767px) 100vw, 42vw'}
                  alt={photo.alt}
                  className="transition-opacity group-hover:opacity-90"
                  width={photo.width}
                  height={photo.height}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  fetchPriority={index < 3 ? 'high' : 'auto'}
                />
              </picture>
              <figcaption>{photo.location || photo.alt}</figcaption>
            </figure>
          </Button>
        ))}
      </div>
    </>
  );
}
