'use client';

import { useEffect, useState } from 'react';

import { IconButton } from 'components/ui/IconButton';

import { PhotoType } from './getPhotos';

type PhotoGalleryProps = {
  photos: PhotoType[];
};

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  // Reset image loaded state when photo changes
  useEffect(() => {
    setImageLoaded(false);
    setShowSpinner(false);

    // Only show spinner if image takes more than 1000ms to load
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedIndex]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when closing
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
        setIsFullScreen(true);
      }
      if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
      if (e.key === 'ArrowRight' && selectedIndex < photos.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  function formatDate(dateString?: Date) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    // Prevent default scrolling behavior
    e.preventDefault();
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || selectedIndex === null) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    // Horizontal swipe
    if (isHorizontalSwipe) {
      // Swipe left (next photo)
      if (distanceX > minSwipeDistance && selectedIndex < photos.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
      // Swipe right (previous photo or close if first photo)
      if (distanceX < -minSwipeDistance) {
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        } else {
          // Return to overview if swiping right on first photo
          setSelectedIndex(null);
          setIsFullScreen(true);
        }
      }
    }
    // Vertical swipe
    else {
      // Swipe up (next photo, like TikTok scrolling forward)
      if (distanceY > minSwipeDistance && selectedIndex < photos.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
      // Swipe down (previous photo or close if first photo, like TikTok)
      if (distanceY < -minSwipeDistance) {
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        } else {
          // Return to overview if swiping down on first photo
          setSelectedIndex(null);
          setIsFullScreen(true);
        }
      }
    }
  };

  return (
    <>
      {/* Photo Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            className="relative block aspect-square"
          >
            <picture>
              <source
                srcSet={photo.srcSetWebp}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                type="image/webp"
              />
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={photo.id < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full rounded-lg object-cover transition-opacity hover:opacity-90"
                style={{
                  backgroundImage: `url(${photo.blurDataURL})`,
                  backgroundSize: 'cover'
                }}
              />
            </picture>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 top-0 left-0 z-50 h-dvh w-screen overflow-hidden overscroll-none bg-slate-950 p-4 md:p-8"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <IconButton
            onClick={() => {
              setSelectedIndex(null);
              setIsFullScreen(true);
            }}
            className="fixed top-3 right-3 z-20 text-xl md:top-5 md:right-5"
            variant="overlay"
            size="lg"
            aria-label="Close"
          >
            ✕
          </IconButton>
          <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
            {!imageLoaded && showSpinner && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-white" />
                  <p className="text-sm text-slate-400">Loading photo...</p>
                </div>
              </div>
            )}
            <picture>
              <source
                srcSet={selectedPhoto.srcSetWebp}
                sizes="100vw"
                type="image/webp"
              />
              <img
                src={selectedPhoto.src}
                srcSet={selectedPhoto.srcSet}
                sizes="100vw"
                alt={selectedPhoto.alt}
                width={selectedPhoto.width}
                height={selectedPhoto.height}
                loading="eager"
                decoding="async"
                className={`cursor-pointer object-contain transition-opacity duration-300 ${
                  isFullScreen ? 'fixed inset-0 h-dvh w-screen object-cover' : 'max-h-[85dvh] w-auto rounded-lg'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                role="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                onLoad={() => setImageLoaded(true)}
                style={{
                  backgroundImage: `url(${selectedPhoto.blurDataURL})`,
                  backgroundSize: 'cover'
                }}
              />
            </picture>
          </div>
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 px-3 md:bottom-5">
            <div className="rounded-md bg-black/50 p-2 text-center text-sm text-gray-200 backdrop-blur-sm">
              <div className="md:hidden">{selectedPhoto.location}</div>
              <div className="md:hidden">{formatDate(selectedPhoto.createdAt)}</div>
              <div className="hidden md:block">
                {selectedPhoto.location} • {formatDate(selectedPhoto.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
