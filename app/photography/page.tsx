import { Metadata } from 'next';

import { getPhotos } from './getPhotos';
import { PhotoGallery } from './PhotoGallery';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

// Cache page data for 1 hour
export const revalidate = 3600;

export default async function Photography() {
  const photos = await getPhotos();

  return <PhotoGallery photos={photos} />;
}
