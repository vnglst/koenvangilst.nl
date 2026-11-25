import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getMdxComponent } from '#/cms/mdx-parser';
import { MarkdownLayout } from '#/components/content/MarkdownLayout';
import { NotFoundPage } from '#/components/content/NotFoundPage';
import { jsonLdArticle } from '#/lib/json-ld';
import { createPostOgImage } from '#/lib/og-image.mjs';
import { readOgSource } from '#/lib/og-source';

const getArticle = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getArticles, getPost } = await import('#/cms/posts-server');
    const post = getPost(data.slug);
    if (!post) throw notFound();
    if (post.url?.startsWith('/') && post.url !== `/articles/${post.slug}`) {
      throw redirect({ href: post.url, statusCode: 301 });
    }

    // The Articles list is newest first, so reading on means moving to the older neighbour.
    const articles = getArticles();
    const index = articles.findIndex((p) => p.slug === data.slug);
    const older = index === -1 ? undefined : articles.at(index + 1);
    const ogImage = createPostOgImage({
      slug: post.slug,
      title: post.title,
      description: post.summary,
      imageDigest: readOgSource(post.image?.src)?.digest
    });

    return {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      hasContent: post.hasContent,
      tags: post.tags,
      image: post.image,
      ogImageUrl: ogImage.url,
      url: post.url,
      nextArticle: older ? { slug: older.slug, title: older.title } : null
    };
  });

export const Route = createFileRoute('/articles/$slug')({
  loader: ({ params }) => getArticle({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const ogImage = loaderData ? `https://koenvangilst.nl${loaderData.ogImageUrl}` : undefined;
    const links: { rel: string; href: string }[] = [];
    if (loaderData) {
      links.push({ rel: 'canonical', href: `https://koenvangilst.nl/articles/${loaderData.slug}` });
      if (loaderData.nextArticle) {
        links.push({ rel: 'prefetch', href: `https://koenvangilst.nl/articles/${loaderData.nextArticle.slug}` });
      }
    }
    return {
      meta: [
        { title: `${loaderData ? loaderData.title : ''} | Koen van Gilst` },
        { name: 'description', content: loaderData ? loaderData.summary : '' },
        ...(ogImage
          ? [
              { property: 'og:url', content: `https://koenvangilst.nl/articles/${loaderData!.slug}` },
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
      links
    };
  },
  notFoundComponent: () => <NotFoundPage />,
  component: PostPage
});

function PostPage() {
  const postMeta = Route.useLoaderData();
  const { slug } = Route.useParams();

  const Component = getMdxComponent(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdArticle({
              headline: postMeta.title,
              description: postMeta.summary,
              datePublished: postMeta.publishedAt,
              url: `https://koenvangilst.nl/articles/${postMeta.slug}`,
              ...(postMeta.image ? { image: `https://koenvangilst.nl${postMeta.image.src}` } : {})
            })
          )
        }}
      />
      {Component && (
        <MarkdownLayout
          post={postMeta}
          nextArticle={postMeta.nextArticle}
          Component={
            !postMeta.hasContent
              ? () => (
                  <>
                    <p>{postMeta.summary}</p>
                    {postMeta.url && (
                      <p>
                        <a href={postMeta.url}>Visit project ↗</a>
                      </p>
                    )}
                  </>
                )
              : Component
          }
        />
      )}
    </>
  );
}
