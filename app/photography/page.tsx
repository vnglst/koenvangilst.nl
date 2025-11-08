import { Metadata } from 'next';

import { Container } from 'components/layout/Container';

import { getPhotos } from './getPhotos';
import { PhotoGrid } from './PhotoGrid';
import { ScrollRestoration } from './ScrollRestoration';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

export default async function Photography() {
  const photos = await getPhotos();

  return (
    <Container footer>
      <ScrollRestoration />
      <PhotoGrid photos={photos} />
    </Container>
  );
}
