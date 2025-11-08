'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PhotoType } from '../getPhotos';

export function Photo({
  photo,
  photos,
  currentIndex
}: {
  photo: PhotoType;
  photos: PhotoType[];
  currentIndex: number;
}) {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/photography', { scroll: false });
      }

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        router.push(`/photography/${photos[currentIndex - 1].id}`, { scroll: false });
      }
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        router.push(`/photography/${photos[currentIndex + 1].id}`, { scroll: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos, router]);

  function formatDate(dateString?: Date) {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <div className="h-full w-full bg-slate-950 p-4 md:p-8">
      <Link
        href="/photography"
        className="fixed top-5 right-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-white/90 hover:text-black"
      >
        ✕
      </Link>
      <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 2400px"
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="eager"
          decoding="async"
          className={`cursor-pointer object-contain ${
            isFullScreen ? 'fixed h-screen w-screen object-cover' : 'max-h-[85vh] w-auto rounded-lg'
          }`}
          role="button"
          onClick={() => setIsFullScreen(!isFullScreen)}
          style={{
            backgroundImage: `url(${photo.blurDataURL})`,
            backgroundSize: 'cover'
          }}
        />
      </div>
      <div className="fixed bottom-5 left-0 flex w-full items-center justify-between gap-4 px-5">
        {currentIndex > 0 ? (
          <Link
            href={`/photography/${photos[currentIndex - 1].id}`}
            className="m-auto grid h-10 w-10 place-items-center rounded-full bg-black/50 text-sm text-gray-200 backdrop-blur-sm hover:bg-white/90 hover:text-black"
            aria-label="Previous photo"
          >
            ←
          </Link>
        ) : (
          <div className="m-auto h-10 w-10" />
        )}
        <div className="rounded-md bg-black/50 p-2 text-center text-sm text-gray-200 backdrop-blur-sm">
          <div className="md:hidden">{photo.location}</div>
          <div className="md:hidden">{formatDate(photo.createdAt)}</div>
          <div className="hidden md:block">
            {photo.location} • {formatDate(photo.createdAt)}
          </div>
        </div>
        {currentIndex < photos.length - 1 ? (
          <Link
            href={`/photography/${photos[currentIndex + 1].id}`}
            className="m-auto grid h-10 w-10 place-items-center rounded-full bg-black/50 text-sm text-gray-200 backdrop-blur-sm hover:bg-white/90 hover:text-black"
            aria-label="Next photo"
          >
            →
          </Link>
        ) : (
          <div className="m-auto h-10 w-10" />
        )}
      </div>
    </div>
  );
}
