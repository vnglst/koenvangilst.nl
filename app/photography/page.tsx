import { Metadata } from 'next';
import { Suspense } from 'react';

import { Container } from 'components/layout/Container';

import { getPhotos } from './getPhotos';
import { PhotoGallery } from './PhotoGallery';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

export const revalidate = 3600;

export default async function Photography({ searchParams }: { searchParams: Promise<{ photo?: string }> }) {
  const photos = await getPhotos();
  const params = await searchParams;

  // Full-screen gallery mode (no container)
  if (params.photo !== undefined) {
    return (
      <Suspense>
        <PhotoGallery photos={photos} />
      </Suspense>
    );
  }

  // Grid overview mode (with container)
  return (
    <Container footer wide>
      <Suspense>
        <PhotoGallery photos={photos} />
      </Suspense>
    </Container>
  );
}
