import { Suspense } from 'react';
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
              key={photo.id}
              href={`/photography/photo/${photo.id}`}
              scroll={false}
              className={`relative block aspect-square md:aspect-auto ${photo.isVertical ? 'row-span-2' : 'row-span-1'}`}
            >
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={photo.id < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full rounded-lg object-cover transition-opacity hover:opacity-90"
                style={{
                  backgroundImage: `url(${photo.blurDataURL})`,
                  backgroundSize: 'cover'
                }}
              />
            </Link>
          );
        })}
      </Suspense>
    </div>
  );
}
