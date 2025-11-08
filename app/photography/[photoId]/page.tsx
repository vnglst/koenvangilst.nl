import { getPhotos } from '../getPhotos';
import { Photo } from './Photo';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{
    photoId: string;
  }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const photos = await getPhotos();
  const photoId = decodeURIComponent(params.photoId);
  const currentIndex = photos.findIndex((p) => decodeURIComponent(p.id) === photoId);
  const photo = photos[currentIndex];

  if (!photo) return null;

  return {
    title: `Photo: ${photo.location}`,
    description: `A photograph taken in ${photo.location}`
  };
}

export async function generateStaticParams() {
  return getPhotos().then((photos) => {
    return photos.map((photo) => ({ photoId: photo.id }));
  });
}

export default async function PhotoPage({ params }: { params: Promise<{ photoId: string }> }) {
  const photos = await getPhotos();
  const photoId = decodeURIComponent((await params).photoId);
  const currentIndex = photos.findIndex((p) => decodeURIComponent(p.id) === photoId);
  const photo = photos[currentIndex];

  if (!photo) return null;

  return <Photo photo={photo} photos={photos} currentIndex={currentIndex} />;
}
