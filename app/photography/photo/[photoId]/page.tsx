import { notFound } from 'next/navigation';

import { getPhotos } from '../../getPhotos';
import { PhotoPage as PhotoPageComponent } from './PhotoPage';

type Props = {
  params: Promise<{
    photoId: string;
  }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const photos = await getPhotos();
  const photoId = parseInt(params.photoId, 10);

  if (isNaN(photoId) || photoId < 0 || photoId >= photos.length) {
    return null;
  }

  const photo = photos[photoId];

  return {
    title: `Photo: ${photo.location}`,
    description: `A photograph taken in ${photo.location}`
  };
}

export async function generateStaticParams() {
  const photos = await getPhotos();
  return photos.map((photo) => ({ photoId: photo.id.toString() }));
}

export default async function PhotoPage({ params }: Props) {
  const photos = await getPhotos();
  const photoId = parseInt((await params).photoId, 10);

  if (isNaN(photoId) || photoId < 0 || photoId >= photos.length) {
    notFound();
  }

  const photo = photos[photoId];
  const currentIndex = photoId;

  return <PhotoPageComponent photo={photo} photos={photos} currentIndex={currentIndex} />;
}
