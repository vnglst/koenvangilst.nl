import { PhotoModal } from '../@modal/(.)[photoId]/PhotoModal';
import { getPhotos } from '../getPhotos';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return getPhotos().then((photos) => {
    return photos.map((photo) => ({ slug: photo.id }));
  });
}

export default async function PhotoPage({ params }: { params: Promise<{ photoId: string }> }) {
  const photos = await getPhotos();
  const photoId = (await params).photoId;
  const currentIndex = photos.findIndex((p) => p.src.includes(photoId));
  const photo = photos[currentIndex];

  if (!photo) return null;

  return <PhotoModal photo={photo} photos={photos} currentIndex={currentIndex} />;
}
