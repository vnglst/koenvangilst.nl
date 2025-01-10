import { Metadata } from 'next';

import { getPhotos } from '../../getPhotos';

import { PhotoModal } from './PhotoModal';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

export default async function PhotoPage({ params }: { params: Promise<{ photoId: string }> }) {
  const photos = await getPhotos();
  const photoId = (await params).photoId;
  const currentIndex = photos.findIndex((p) => p.id === photoId);
  const photo = photos[currentIndex];

  if (!photo) return null;

  return <PhotoModal photo={photo} photos={photos} currentIndex={currentIndex} />;
}
