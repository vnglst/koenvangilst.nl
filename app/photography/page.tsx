import { Suspense } from 'react';

import { Heading } from 'components/Heading';

import { getPhotos } from './getPhotos';
import { PhotoGrid } from './PhotoGrid';

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
