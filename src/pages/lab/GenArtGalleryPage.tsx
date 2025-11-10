import { Helmet } from 'react-helmet-async';

import { GenerativeArtGallery } from '../../../app/lab/gen-art-gallery/GenerativeArtGallery';

export function GenArtGalleryPage() {
  return (
    <>
      <Helmet>
        <title>Generative Art Gallery | Koen van Gilst</title>
        <meta name="description" content="A full-screen gallery of generative art projects by Koen van Gilst." />
      </Helmet>
      <GenerativeArtGallery />
    </>
  );
}
