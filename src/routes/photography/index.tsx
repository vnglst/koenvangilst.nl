import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { Container } from '#/components/layout/Container';
import { getPhotos } from '#/lib/photos';

import { PhotoGallery } from './_components/PhotoGallery';

const fetchPhotos = createServerFn({ method: 'GET' }).handler(() => getPhotos());

const searchSchema = z.object({
  photo: z.string().optional()
});

export const Route = createFileRoute('/photography/')({
  validateSearch: searchSchema,
  loader: () => fetchPhotos(),
  head: () => ({
    meta: [
      { title: 'Photography | Koen van Gilst' },
      { name: 'description', content: 'A collection of photographs by Koen van Gilst' }
    ]
  }),
  component: Photography
});

function Photography() {
  const photos = Route.useLoaderData();
  const { photo } = Route.useSearch();

  if (photo !== undefined) {
    return <PhotoGallery photos={photos} />;
  }

  return (
    <Container footer wide>
      <PhotoGallery photos={photos} />
    </Container>
  );
}
