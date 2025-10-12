import { GenerativeArtGallery } from './GenerativeArtGallery';

export async function generateMetadata() {
  return {
    title: 'Generative Art Gallery',
    description: 'A full-screen gallery of generative art projects by Koen van Gilst.'
  };
}

export default function GalleryPage() {
  return <GenerativeArtGallery />;
}
