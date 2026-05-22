import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Heading } from '#/components/content/Heading';
import { Container } from '#/components/layout/Container';
import { BlogPostLink } from '#/components/ui/PostLink';
import { TagLink } from '#/components/ui/Tag';
import { getPosts } from '#/cms/mdx-parser';
import { desluggify, sluggify } from '#/lib/sluggify';

const getTagData = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const allPosts = await getPosts();
    const posts = allPosts.filter((p) => p.tagsAsSlugs.includes(slug));
    const uniqueTags = [...new Set(allPosts.flatMap((p) => p.tags))];

    if (posts.length === 0) {
      throw notFound();
    }

    return { posts, uniqueTags };
  });

export const Route = createFileRoute('/tag/$slug')({
  loader: async ({ params }) => getTagData({ data: params.slug }),
  head: ({ params, loaderData }) => {
    const tag = desluggify(params.slug);
    const postCount = loaderData?.posts.length ?? 0;
    const ogImage = `https://koenvangilst.nl/og?title=${encodeURIComponent(`Posts about ${tag}`)}&description=${encodeURIComponent(`${postCount} post${postCount === 1 ? '' : 's'} about ${tag}`)}&type=tag`;
    return {
      meta: [
        { title: `Posts about ${tag} | Koen van Gilst` },
        { name: 'description', content: `All posts about ${tag}` },
        { property: 'og:title', content: `Posts about ${tag}` },
        { property: 'og:description', content: `All posts about ${tag}` },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: ogImage },
      ],
    };
  },
  component: TagPage
});

function TagPage() {
  const { slug } = Route.useParams();
  const { posts, uniqueTags } = Route.useLoaderData();
  const tag = desluggify(slug);

  return (
    <Container>
      <Heading level={1}>Posts about {tag}</Heading>
      <section className="mb-4 flex w-full flex-col gap-6">
        <p className="mt-6 text-gray-600 dark:text-gray-400">
          There are <b>{posts.length} post(s)</b> about the topic {tag}.
        </p>
        {posts.map((post) => (
          <BlogPostLink key={post.title} {...post} />
        ))}
      </section>
      <section className="mt-8 text-sm text-gray-700 dark:text-gray-300">
        <Heading level={2}>Other tags</Heading>
        <ul className="flex w-full flex-wrap gap-3">
          {uniqueTags.map((t) => (
            <li key={t}>
              <TagLink href={`/tag/${sluggify(t)}`}>{t}</TagLink>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
