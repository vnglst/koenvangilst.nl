import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { Container } from '#/components/layout/Container';

import { FullScreenGallery, PhotoGallery } from './_components/PhotoGallery';
import { usePhotos } from './_components/usePhotos';

export const Route = createFileRoute('/photography/$photo')({
  head: ({ params }) => ({
    meta: [
      { title: 'Photography | Koen van Gilst' },
      {
        name: 'description',
        content: 'A collection of photographs by Koen van Gilst'
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `https://koenvangilst.nl/photography/${params.photo}` },
      { property: 'og:title', content: 'Photography | Koen van Gilst' },
      { property: 'og:description', content: 'A collection of photographs by Koen van Gilst' },
      { name: 'twitter:card', content: 'summary' }
    ],
    links: [{ rel: 'canonical', href: `https://koenvangilst.nl/photography/${params.photo}` }]
  }),
  component: PhotographyPhoto
});

function PhotographyPhoto() {
  const { photos, failed } = usePhotos();
  const navigate = useNavigate();
  const { photo: photoId } = Route.useParams();
  const selectedPhotoId = Number(photoId);

  useEffect(() => {
    if (photos && !photos.some((photo) => photo.id === selectedPhotoId)) {
      void navigate({ to: '/404', replace: true });
    }
  }, [navigate, photos, selectedPhotoId]);

  if (!photos || failed) {
    return (
      <Container footer wide>
        <PhotoGallery photos={[]} />
      </Container>
    );
  }

  const selectedIndex = photos.findIndex((photo) => photo.id === selectedPhotoId);

  if (selectedIndex === -1) return null;

  return <FullScreenGallery photos={photos} startIndex={selectedIndex} />;
}
