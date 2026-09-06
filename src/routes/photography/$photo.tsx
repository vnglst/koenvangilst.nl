import { createFileRoute, notFound } from '@tanstack/react-router';

import type { PhotoType } from '#/lib/photos';

import { FullScreenGallery } from './_components/PhotoGallery';

async function getStaticPhotos(): Promise<PhotoType[]> {
  if (typeof window !== 'undefined') {
    const response = await fetch('/photos-data.json');
    if (!response.ok) throw new Error('Unable to load photography data');
    return response.json() as Promise<PhotoType[]>;
  }
  return (await import('#/lib/photos')).getPhotos();
}

export const Route = createFileRoute('/photography/$photo')({
  loader: () => getStaticPhotos(),
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
  const photos = Route.useLoaderData();
  const { photo: photoId } = Route.useParams();
  const selectedIndex = photos.findIndex((photo) => photo.id === Number(photoId));

  if (selectedIndex === -1) {
    throw notFound();
  }

  return <FullScreenGallery photos={photos} startIndex={selectedIndex} />;
}
