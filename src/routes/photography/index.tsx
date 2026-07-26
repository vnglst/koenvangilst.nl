import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Container } from '#/components/layout/Container';
import { getPhotos } from '#/lib/photos';

import { PhotoGallery } from './_components/PhotoGallery';

const fetchPhotos = createServerFn({ method: 'GET' }).handler(() => getPhotos());

export const Route = createFileRoute('/photography/')({
  loader: () => fetchPhotos(),
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
