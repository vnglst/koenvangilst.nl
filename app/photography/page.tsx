import { Metadata } from 'next';

import { Heading } from 'components/content/Heading';
import { Container } from 'components/layout/Container';

import { getPhotos } from './getPhotos';
import { PhotoGrid } from './PhotoGrid';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A collection of photographs by Koen van Gilst'
};

export default async function Photography() {
  const photos = await getPhotos();

  return (
    <Container footer={false} nav={true} useLayout={true}>
      <Heading level={1}>Photography</Heading>
      <PhotoGrid photos={photos} />
    </Container>
  );
}
