import { createFileRoute } from '@tanstack/react-router'
import { GenerativeArtGallery } from './_components/GenerativeArtGallery'

export const Route = createFileRoute('/lab/gen-art-gallery/')({
  head: () => ({
    meta: [
      { title: 'Generative Art Gallery | Koen van Gilst' },
      { name: 'description', content: 'A full-screen gallery of generative art projects by Koen van Gilst.' },
    ],
  }),
  component: GalleryPage,
})

function GalleryPage() {
  return <GenerativeArtGallery />
}
