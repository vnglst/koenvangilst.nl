'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { Photo } from '../../types';

export function PhotoModal({ photo, photos, currentIndex }: { photo: Photo; photos: Photo[]; currentIndex: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open && pathname === `/photography/${photo.id}`) {
      document.body.style.overflow = 'hidden';
      dialogRef.current?.showModal();
    }
  }, [pathname, photo.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  function onDismiss() {
    document.body.style.overflow = 'scroll';
    dialogRef.current?.close();
    router.push('/photography', { scroll: false });
  }

  function formatDate(dateString?: Date) {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      className="h-auto w-auto animate-fade-in bg-transparent backdrop:bg-black/95 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col items-center justify-center p-4 md:p-8">
        <button
          onClick={onDismiss}
          className="backdrop-blur-xs fixed right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-black text-white hover:bg-white/90 hover:text-black"
        >
          ✕
        </button>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="mx-auto h-[85vh] max-h-[85vh] w-auto rounded-lg object-contain"
          priority
        />
        <div className="mt-3 flex w-full items-center justify-between gap-4">
          {currentIndex > 0 ? (
            <button
              onClick={() => router.push(`/photography/${photos[currentIndex - 1].id}`, { scroll: false })}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-white/90 hover:text-black"
              aria-label="Previous photo"
            >
              ←
            </button>
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
            <button
              onClick={() => router.push(`/photography/${photos[currentIndex + 1].id}`, { scroll: false })}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-white/90 hover:text-black"
              aria-label="Next photo"
            >
              →
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      </div>
    </dialog>
  );
}
