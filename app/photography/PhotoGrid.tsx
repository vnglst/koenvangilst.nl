import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { PhotoType } from './getPhotos';

type PhotoGridProps = {
  photos: PhotoType[];
};

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[300px]">
      <Suspense>
        {photos.map((photo) => {
          return (
            <Link
              key={photo.src}
              href={`/photography/${photo.id}`}
              passHref
              scroll={false}
              className={`relative block aspect-square md:aspect-auto ${photo.isVertical ? 'row-span-2' : 'row-span-1'}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                priority={photos.indexOf(photo) < 4}
                className="rounded-lg object-cover transition-opacity hover:opacity-90"
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
              />
            </Link>
          );
        })}
      </Suspense>
    </div>
  );
}
