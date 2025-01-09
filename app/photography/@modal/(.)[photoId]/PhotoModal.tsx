'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export function PhotoModal({ photo, photos, currentIndex }) {
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

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      className="h-full w-full animate-fade-in bg-transparent p-0 backdrop:bg-white/80 backdrop:backdrop-blur-sm backdrop:dark:bg-black/80"
    >
      <button
        onClick={onDismiss}
        className="fixed right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-black backdrop-blur-sm transition-colors hover:bg-white/70 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
      >
        ✕
      </button>
      <div className="flex h-full items-center justify-center p-4 md:p-8">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-[90vh] w-auto rounded-lg"
          priority
        />
      </div>
    </dialog>
  );
}
