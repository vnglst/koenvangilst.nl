import { getPhotos } from '../../../getPhotos';
import { PhotoModal } from './PhotoModal';

type Props = {
  params: Promise<{
    photoId: string;
  }>;
};

export default async function PhotoModalPage({ params }: Props) {
  const photos = await getPhotos();
  const photoId = parseInt((await params).photoId, 10);

  if (isNaN(photoId) || photoId < 0 || photoId >= photos.length) {
    return null;
  }

  const photo = photos[photoId];
  const currentIndex = photoId;

  return <PhotoModal photo={photo} photos={photos} currentIndex={currentIndex} />;
}
