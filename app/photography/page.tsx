import { Suspense } from 'react';
import { Metadata } from 'next';

import { Heading } from 'components/Heading';

import { getPhotos } from './getPhotos';
import { PhotoGrid } from './PhotoGrid';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

export default async function Photography() {
  const photos = await getPhotos();

  return (
    <>
      <Heading level={1}>Photography</Heading>
      <Suspense fallback={<PhotoGrid photos={[]} />}>
        <PhotoGrid photos={photos} />
      </Suspense>
    </>
  );
}
