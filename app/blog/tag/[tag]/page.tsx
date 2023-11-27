import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogPost from 'components/BlogPost';
import { Heading } from 'ui/Heading';
import { Tag } from 'ui/Tag';

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
    <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16 break-words">
      <Heading level={1}>Posts about {tagLabel}</Heading>
      <section className="relative w-full mb-4">
        <p className="mt-6 mb-6 text-gray-600 dark:text-gray-400">
          There are <b>{blogs.length} post(s)</b> about the topic {tagLabel}.
        </p>
        {blogs.map((post) => (
          <BlogPost key={post.title} {...post} />
        ))}
      </section>
      <footer className="text-sm text-gray-700 dark:text-gray-300 mt-8">
        <Heading level={2}>Other tags</Heading>
        <ul className="flex flex-wrap w-full gap-3">
          {getUniqueTagSlugs().map((tag) => (
            <li key={tag}>
              <Tag tag={tag} />
            </li>
          ))}
        </ul>
      </footer>
    </article>
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
