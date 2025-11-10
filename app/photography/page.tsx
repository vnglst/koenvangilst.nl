import { Container } from 'components/layout/Container';

import { getPhotos } from './getPhotos';
import { PhotoGallery } from './PhotoGallery';

export default async function Photography() {
  const photos = await getPhotos();

  return (
    <Container footer>
      <PhotoGallery photos={photos} />
    </Container>
  );
}
