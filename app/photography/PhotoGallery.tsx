'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PhotoType } from './getPhotos';

type PhotoGalleryProps = {
  photos: PhotoType[];
};

type LazyPhotoProps = {
  photo: PhotoType;
  index: number;
};

function LazyPhoto({ photo, index }: LazyPhotoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Delay showing spinner to avoid flash on cached images
  useEffect(() => {
    if (!isVisible || hasLoaded) return;

    const timer = setTimeout(() => {
      if (!hasLoaded) {
        setShowSpinner(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isVisible, hasLoaded]);

  function formatDate(dateString?: Date) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full snap-start snap-always items-center justify-center bg-slate-950"
      id={`photo-${index}`}
    >
      {isVisible && (
        <>
          {!hasLoaded && showSpinner && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
              <div className="text-center text-white">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-white" />
                <p className="text-sm">Loading photo...</p>
              </div>
            </div>
          )}
          <picture className="h-full w-full">
            <source srcSet={photo.srcSetWebp} sizes="100vw" type="image/webp" />
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-contain transition-opacity duration-300 ${
                hasLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setHasLoaded(true)}
              style={{
                backgroundImage: `url(${photo.blurDataURL})`,
                backgroundSize: 'cover'
              }}
            />
          </picture>
        </>
      )}
      {/* Photo info overlay */}
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
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToPhoto = (index: number, smooth = true) => {
    const element = document.getElementById(`photo-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
    }
  };

  // Scroll to start index on mount (instant, no animation)
  useEffect(() => {
    if (startIndex > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => scrollToPhoto(startIndex, false), 100);
    }
  }, [startIndex]);

  // Track current photo with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const index = parseInt(id.split('-')[1]);
            setCurrentIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5
      }
    );

    const photoElements = document.querySelectorAll('[id^="photo-"]');
    photoElements.forEach((photo) => observer.observe(photo));

    return () => {
      photoElements.forEach((photo) => observer.unobserve(photo));
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.replace('/photography');
      } else if (e.key === 'ArrowDown' || e.key === ' ') {
        if (currentIndex < photos.length - 1) {
          scrollToPhoto(currentIndex + 1);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        if (currentIndex > 0) {
          scrollToPhoto(currentIndex - 1);
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, router]);

  const handleClose = () => {
    // Navigate back to grid view
    router.replace('/photography');
  };

  const progressPercentage = ((currentIndex + 1) / photos.length) * 100;

  return (
    <div className="relative">
      {/* Top navigation bar */}
      <nav className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-2 backdrop-blur-sm sm:gap-2 sm:px-4">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-sm text-white transition-opacity hover:opacity-60"
        >
          <span>←</span>
          <span className="hidden sm:inline">Back</span>
        </button>
        <span className="hidden text-white sm:inline">|</span>
        <span className="text-xs text-white sm:text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
      </nav>

      {/* Vertical progress bar */}
      <div className="fixed top-0 right-0 z-50 h-screen w-1 bg-white/10">
        <div
          className="w-full bg-white/60 transition-all duration-300 ease-out"
          style={{ height: `${progressPercentage}%` }}
        />
      </div>

      <div ref={containerRef} className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {photos.map((photo, index) => (
          <LazyPhoto key={photo.id} photo={photo} index={index} />
        ))}
      </div>
    </div>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const photoParam = searchParams.get('photo');
  const selectedIndex = photoParam !== null ? parseInt(photoParam, 10) : null;

  const openPhoto = (index: number) => {
    router.push(`/photography?photo=${index}`);
  };

  // Show full-screen gallery if a photo is selected
  if (selectedIndex !== null && !isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < photos.length) {
    return <FullScreenGallery photos={photos} startIndex={selectedIndex} />;
  }

  // Show grid overview
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <button key={photo.id} onClick={() => openPhoto(index)} className="relative block aspect-square">
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
  );
}
