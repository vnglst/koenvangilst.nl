import { getPosts } from 'cms/mdx-parser';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Heading } from 'components/content/Heading';
import { Container } from 'components/layout/Container';
import { BlogPostLink } from 'components/ui/PostLink';
import { TagLink } from 'components/ui/Tag';
import { desluggify, sluggify } from 'lib/sluggify';

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const allPosts = await getPosts();
  const posts = allPosts.filter((p) => p.tagsAsSlugs?.includes(params.slug));
  const uniqueTags = await getUniqueTagSlugs();

  if (posts.length === 0) {
    notFound();
  }

  const tag = desluggify(params.slug);

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
          {uniqueTags.map((tag) => (
            <li key={tag}>
              <TagLink href={`/tag/${sluggify(tag)}`}>{tag}</TagLink>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}

async function getUniqueTagSlugs() {
  const posts = await getPosts();
  const tags = posts.map((post) => post.tags).flat();
  const uniqueTags = [...new Set(tags)];
  return uniqueTags;
}

export async function generateStaticParams() {
  const uniqueTags = await getUniqueTagSlugs();
  return uniqueTags.map((tag) => ({ params: { tag } }));
}

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params;
  const tag = desluggify(params.slug);

  return {
    title: `Posts about ${tag}`,
    description: `All posts about ${tag}`,
    openGraph: {
      title: `Posts about ${tag}`,
      description: `All posts about ${tag}`
    }
  };
}
