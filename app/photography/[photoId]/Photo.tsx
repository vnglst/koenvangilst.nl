'use client';

import { useEffect } from 'react';
import Image from 'next/image';
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
    <div className="h-full w-full bg-black p-4 md:p-8">
      <Link
        href="/photography"
        className="backdrop-blur-xs fixed right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-black text-white hover:bg-white/90 hover:text-black"
      >
        ✕
      </Link>
      <div className="mx-auto flex h-full w-fit flex-col items-center justify-center">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="h-[85vh] w-auto rounded-lg object-contain"
          priority
        />
        <div className="mt-5 flex w-full items-center justify-between gap-4">
          {currentIndex > 0 ? (
            <Link
              href={`/photography/${photos[currentIndex - 1].id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-sm text-gray-400 backdrop-blur-sm hover:bg-white/90 hover:text-black"
              aria-label="Previous photo"
            >
              ←
            </Link>
          ) : (
            <div className="h-10 w-10" />
          )}
          <div className="text-center text-sm text-gray-400">
            <div className="md:hidden">{photo.location}</div>
            <div className="md:hidden">{formatDate(photo.createdAt)}</div>
            <div className="hidden md:block">
              {photo.location} • {formatDate(photo.createdAt)}
            </div>
          </div>
          {currentIndex < photos.length - 1 ? (
            <Link
              href={`/photography/${photos[currentIndex + 1].id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-sm text-gray-400 backdrop-blur-sm hover:bg-white/90 hover:text-black"
              aria-label="Next photo"
            >
              →
            </Link>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      </div>
    </div>
  );
}
