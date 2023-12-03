import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogPostLink } from 'components/BlogPostLink';
import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Tag } from 'components/Tag';

import { allBlogs } from 'contentlayer/generated';

export const revalidate = 60 * 30;

type TagPageProps = {
  params: { tag: string };
};

export default async function TagPage({ params }: TagPageProps) {
  const blogs = findBlogsForTag(params.tag);

  if (blogs.length === 0) {
    notFound();
  }

  const tagLabel = params.tag.split('-').join(' ');

  return (
    <Container>
      <Heading level={1}>Posts about {tagLabel}</Heading>
      <section className="mb-4 w-full">
        <p className="mb-6 mt-6 text-gray-600 dark:text-gray-400">
          There are <b>{blogs.length} post(s)</b> about the topic {tagLabel}.
        </p>
        {blogs.map((post) => (
          <BlogPostLink key={post.title} {...post} />
        ))}
      </section>
      <section className="mt-8 text-sm text-gray-700 dark:text-gray-300">
        <Heading level={2}>Other tags</Heading>
        <ul className="flex w-full flex-wrap gap-3">
          {getUniqueTagSlugs().map((tag) => (
            <li key={tag}>
              <Tag tag={tag} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}

function getUniqueTagSlugs() {
  const tags = allBlogs.flatMap((blog) => blog.tagsAsSlugs ?? []) as string[];
  const uniqueTags = [...new Set(tags)];
  return uniqueTags;
}

export function generateStaticParams() {
  const uniqueTags = getUniqueTagSlugs();
  return uniqueTags.map((tag) => ({ params: { tag } }));
}

export function generateMetadata({ params }): Metadata {
  const tagLabel = params.tag.split('-').join(' ');

  return {
    title: `Posts about ${tagLabel}`,
    description: `All posts about ${tagLabel}`,
    openGraph: {
      title: `Posts about ${tagLabel}`,
      description: `All posts about ${tagLabel}`
    }
  };
}

function findBlogsForTag(tag: string) {
  return allBlogs.filter((blog) => blog.tagsAsSlugs?.includes(tag));
}
