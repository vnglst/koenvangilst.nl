import { getPhotos } from '../utils';
import { PhotoModal } from './PhotoModal';

export default async function PhotoPage({ params }: { params: Promise<{ photoId: string }> }) {
  const { photoId } = await params;
  const photos = await getPhotos();
  const currentIndex = photos.findIndex((p) => p.src.includes(photoId));
  const photo = photos[currentIndex];

  if (!photo) return null;

  return <PhotoModal photo={photo} photos={photos} currentIndex={currentIndex} />;
}
