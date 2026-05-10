import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getPost } from '#/cms/mdx-parser'
import { MarkdownLayout } from '#/components/content/MarkdownLayout'
import { Container } from '#/components/layout/Container'
import { Prose } from '#/components/content/Prose'
import { Heading } from '#/components/content/Heading'
import { Link } from '#/components/ui/Link'

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
  head: ({ loaderData }) => {
    const ogImage = loaderData
      ? `https://koenvangilst.nl/og?title=${encodeURIComponent(loaderData.title)}&description=${encodeURIComponent(loaderData.summary)}&type=blog`
      : undefined
    return {
      meta: [
        { title: `${loaderData?.title ?? ''} | Koen van Gilst` },
        { name: 'description', content: loaderData?.summary ?? '' },
        ...(ogImage
          ? [
              { property: 'og:url', content: `https://koenvangilst.nl/lab/${loaderData!.slug}` },
              { property: 'og:title', content: loaderData!.title },
              { property: 'og:description', content: loaderData!.summary },
              { property: 'og:image', content: ogImage },
              { property: 'og:type', content: 'article' },
              { property: 'article:published_time', content: loaderData!.publishedAt },
              { property: 'article:author', content: 'Koen van Gilst' },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:site', content: '@vnglst' },
              { name: 'twitter:title', content: loaderData!.title },
              { name: 'twitter:description', content: loaderData!.summary },
              { name: 'twitter:image', content: ogImage },
            ]
          : []),
      ],
      links: loaderData
        ? [{ rel: 'canonical', href: `https://koenvangilst.nl/lab/${loaderData.slug}` }]
        : [],
    }
  },
  notFoundComponent: () => (
    <Container>
      <Prose>
        <Heading level={2}>404 - Not found</Heading>
        <p>
          It seems you've found something that used to exist, or you spelled something wrong. I'm
          guessing you spelled something wrong. Can you double-check that URL?
        </p>
        <Link href="/">Return Home</Link>
      </Prose>
    </Container>
  ),
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
    return (
      <Container>
        <Prose>
          <Heading level={2}>404 - Not found</Heading>
          <p>
            It seems you've found something that used to exist, or you spelled something wrong. I'm
            guessing you spelled something wrong. Can you double-check that URL?
          </p>
          <Link href="/">Return Home</Link>
        </Prose>
      </Container>
    )
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
