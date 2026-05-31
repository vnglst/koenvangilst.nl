import { createFileRoute } from '@tanstack/react-router';
import { GenerativeArtGallery } from './_components/GenerativeArtGallery';

export const Route = createFileRoute('/lab/gen-art-gallery/')({
  head: () => ({
    meta: [
      { title: 'Generative Art Gallery | Koen van Gilst' },
      {
        name: 'description',
        content: 'A full-screen gallery of generative art projects by Koen van Gilst.'
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://koenvangilst.nl/lab/gen-art-gallery' },
      { property: 'og:title', content: 'Generative Art Gallery | Koen van Gilst' },
      { property: 'og:description', content: 'A full-screen gallery of generative art projects.' },
      { name: 'twitter:card', content: 'summary' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/lab/gen-art-gallery' }]
  }),
  component: GalleryPage
});

function GalleryPage() {
  return <GenerativeArtGallery />;
}
