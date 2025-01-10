'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { Photo } from './types';

type PhotoGridProps = {
  photos: Photo[];
};

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="mt-4 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {photos.map((photo) => {
        return (
          <Link
            key={photo.src}
            href={`/photography/${photo.id}`}
            passHref
            scroll={false}
            className={`relative block scroll-mt-16 ${photo.isVertical ? 'row-span-2' : 'row-span-1'}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              priority={photos.indexOf(photo) < 4}
              className="rounded-lg object-cover transition-opacity hover:opacity-90"
            />
          </Link>
        );
      })}
    </div>
  );
}
