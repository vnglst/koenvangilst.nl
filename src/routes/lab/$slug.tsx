import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getPost } from '#/cms/mdx-parser'
import { MarkdownLayout } from '#/components/content/MarkdownLayout'

const getLabPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const post = getPost(data.slug)
    if (!post) throw notFound()
    // Component can't be serialized over the wire - return metadata only
    return {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      tags: post.tags,
      tagsAsSlugs: post.tagsAsSlugs,
      image: post.image,
      url: post.url,
    }
  })

export const Route = createFileRoute('/lab/$slug')({
  loader: ({ params }) => getLabPost({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? ''} | Koen van Gilst` },
      { name: 'description', content: loaderData?.summary ?? '' },
    ],
  }),
  notFoundComponent: () => <div className="p-8">Post not found</div>,
  component: PostPage,
})

function PostPage() {
  const postMeta = Route.useLoaderData()
  const { slug } = Route.useParams()

  // Import the compiled MDX component directly on client/server via glob
  // We re-import the modules here to get the React component
  const modules = import.meta.glob<{ default: React.ComponentType }>(
    '../../../content/*.mdx',
    { eager: true }
  )
  const mod = (modules as Record<string, { default: React.ComponentType } | undefined>)[`../../../content/${slug}.mdx`]
  const Component = mod?.default

  if (!Component) {
    return <div className="p-8">Post not found</div>
  }

  return (
    <MarkdownLayout
      publishedAt={postMeta.publishedAt}
      title={postMeta.title}
      readingTime={postMeta.readingTime}
      tags={postMeta.tags}
      path={`/lab/${postMeta.slug}`}
      image={postMeta.image}
      Component={Component}
    />
  )
}
