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
          {!hasLoaded && (
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
              className="h-full w-full object-contain"
              onLoad={() => setHasLoaded(true)}
              style={{
                backgroundImage: `url(${photo.blurDataURL})`,
                backgroundSize: 'cover'
              }}
            />
          </picture>
        </>
      )}
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white">
          <p className="text-sm">{photo.location}</p>
        </div>
      )}

      {/* Photo info overlay */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <div className="text-center text-sm text-white">
          <div>{photo.location}</div>
          <div className="text-xs text-white/80">{formatDate(photo.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}

function FullScreenGallery({ photos, startIndex }: { photos: PhotoType[]; startIndex: number }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToPhoto = (index: number) => {
    const element = document.getElementById(`photo-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to start index on mount
  useEffect(() => {
    if (startIndex > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => scrollToPhoto(startIndex), 100);
    }
  }, [startIndex]);

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

  const handleClose = () => {
    router.push('/photography');
  };

  return (
    <div className="relative">
      <nav className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-2 backdrop-blur-sm sm:gap-2 sm:px-4">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-sm text-white transition-opacity hover:opacity-60"
        >
          <span>←</span>
          <span className="hidden sm:inline">Back to Overview</span>
        </button>
        <span className="hidden text-white sm:inline">|</span>
        <span className="text-xs text-white sm:text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
      </nav>

      <div className="fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToPhoto(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex === index ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
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
