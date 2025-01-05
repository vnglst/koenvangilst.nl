import Image from 'next/image';
import Link from 'next/link';

import { Container } from 'components/Container';
import { getPhotos } from './utils';
import { Heading } from 'components/Heading';

export default async function Photography() {
  const photos = await getPhotos();

  return (
    <Container>
      <Heading level={1}>Photography</Heading>
      <div className="mt-4 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {photos.map((photo) => {
          const photoName = photo.src.split('/').pop();
          return (
            <Link
              key={photo.src}
              href={`/photography/${photoName}`}
              className={`relative block ${photo.isVertical ? 'row-span-2' : 'row-span-1'}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="rounded-lg object-cover transition-opacity hover:opacity-90"
              />
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
