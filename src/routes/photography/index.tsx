import { createFileRoute } from '@tanstack/react-router';

import { Container } from '#/components/layout/Container';
import type { PhotoType } from '#/lib/photos';

import { PhotoGallery } from './_components/PhotoGallery';

async function getStaticPhotos(): Promise<PhotoType[]> {
  if (typeof window !== 'undefined') {
    const response = await fetch('/photos-data.json');
    if (!response.ok) throw new Error('Unable to load photography data');
    return response.json() as Promise<PhotoType[]>;
  }
  return (await import('#/lib/photos')).getPhotos();
}

export const Route = createFileRoute('/photography/')({
  loader: () => getStaticPhotos(),
  head: () => ({
    meta: [
      { title: 'Photography | Koen van Gilst' },
      {
        name: 'description',
        content: 'A collection of photographs by Koen van Gilst'
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://koenvangilst.nl/photography' },
      { property: 'og:title', content: 'Photography | Koen van Gilst' },
      { property: 'og:description', content: 'A collection of photographs by Koen van Gilst' },
      { name: 'twitter:card', content: 'summary' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/photography' }]
  }),
  component: Photography
});

function Photography() {
  const photos = Route.useLoaderData();

  return (
    <Container footer wide>
      <PhotoGallery photos={photos} />
    </Container>
  );
}
