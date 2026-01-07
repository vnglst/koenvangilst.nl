import { Metadata } from 'next';
import { Suspense } from 'react';

import { Container } from 'components/layout/Container';

import { getPhotos } from './getPhotos';
import { PhotoGallery } from './PhotoGallery';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

// Cache page data for 1 hour
export const revalidate = 3600;

export default async function Photography({
  searchParams
}: {
  searchParams: Promise<{ photo?: string }>;
}) {
  const photos = await getPhotos();
  const params = await searchParams;
  const isFullScreen = params.photo !== undefined;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isFullScreen ? (
        <PhotoGallery photos={photos} />
      ) : (
        <Container footer wide>
          <PhotoGallery photos={photos} />
        </Container>
      )}
    </Suspense>
  );
}
