import dynamic from 'next/dynamic';

const GenerativeArtGallery = dynamic(() => import('./GenerativeArtGallery').then((mod) => mod.GenerativeArtGallery), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading gallery...</div>
    </div>
  )
});

export async function generateMetadata() {
  return {
    title: 'Generative Art Gallery',
    description: 'A full-screen gallery of generative art projects by Koen van Gilst.'
  };
}

export default function GalleryPage() {
  return <GenerativeArtGallery />;
}
