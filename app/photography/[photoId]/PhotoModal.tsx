'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type PhotoModalProps = {
  photo: Photo;
  photos: Photo[];
  currentIndex: number;
};

export function PhotoModal({ photo, photos, currentIndex }: PhotoModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/photography');
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevPhoto = photos[currentIndex - 1].src.split('/').pop();
        router.push(`/photography/${prevPhoto}`);
      }
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        const nextPhoto = photos[currentIndex + 1].src.split('/').pop();
        router.push(`/photography/${nextPhoto}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos, router]);

  return (
    <div className="animate-fade-in fixed inset-0 z-20 flex flex-col bg-black/95 backdrop-blur-sm">
      <Link
        href="/photography"
        className="fixed right-6 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
      >
        ✕
      </Link>

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
    </div>
  );
}
