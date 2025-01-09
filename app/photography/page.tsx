import { Suspense } from 'react';

import { Heading } from 'components/Heading';

import { PhotoGrid } from './PhotoGrid';
import { getPhotos } from './getPhotos';

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
