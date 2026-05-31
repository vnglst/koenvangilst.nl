import { Suspense } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getMdxComponent } from '#/cms/mdx-parser';
import { MarkdownLayout } from '#/components/content/MarkdownLayout';
import { NotFoundPage } from '#/components/content/NotFoundPage';
import { Container } from '#/components/layout/Container';

const getLabPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getPost } = await import('#/cms/posts-server');
    const post = getPost(data.slug);
    if (!post) throw notFound();
    return {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      tags: post.tags,
      tagsAsSlugs: post.tagsAsSlugs,
      image: post.image,
      url: post.url
    };
  });

export const Route = createFileRoute('/lab/$slug')({
  loader: ({ params }) => getLabPost({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const ogImage = loaderData ? `https://koenvangilst.nl/og/${loaderData.slug}.png` : undefined;
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
              { name: 'twitter:image', content: ogImage }
            ]
          : [])
      ],
      links: loaderData ? [{ rel: 'canonical', href: `https://koenvangilst.nl/lab/${loaderData.slug}` }] : []
    };
  },
  notFoundComponent: () => <NotFoundPage />,
  component: PostPage
});

function PostPage() {
  const postMeta = Route.useLoaderData();
  const { slug } = Route.useParams();

  const Component = getMdxComponent(slug);

  if (!Component) return <NotFoundPage />;

  return (
    <Suspense fallback={<MarkdownLayoutSkeleton />}>
      <MarkdownLayout
        publishedAt={postMeta.publishedAt}
        title={postMeta.title}
        readingTime={postMeta.readingTime}
        tags={postMeta.tags}
        path={`/lab/${postMeta.slug}`}
        image={postMeta.image}
        Component={Component}
      />
    </Suspense>
  );
}

function MarkdownLayoutSkeleton() {
  return (
    <Container>
      <div className="animate-pulsing-delayed mx-auto w-full min-w-[700px]">
        <div className="w-[486px]">
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mb-8 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mb-4 space-y-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </Container>
  );
}
