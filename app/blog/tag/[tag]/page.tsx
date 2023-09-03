import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogPost from 'components/BlogPost';

import { allBlogs } from 'contentlayer/generated';

export const revalidate = 60 * 30; // 30 min

type TagProps = {
  params: { tag: string };
};

export default async function Tag({ params }: TagProps) {
  const blogs = findBlogsForTag(params.tag);

  if (blogs.length === 0) {
    notFound();
  }

  const tagLabel = params.tag.split('-').join(' ');

  return (
    <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16 break-words">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        Posts about {tagLabel}
      </h1>
      <div className="flex flex-col items-start justify-between w-full mt-2 md:flex-row md:items-center"></div>
      <section className="relative w-full mb-4">
        <p className="mt-6 mb-6 text-gray-600 dark:text-gray-400">
          There are <b>{blogs.length} post(s)</b> about the topic {tagLabel}.
        </p>
        {blogs.map((post) => (
          <BlogPost key={post.title} {...post} />
        ))}
      </section>
      <footer className="text-sm text-gray-700 dark:text-gray-300 mt-8"></footer>
    </article>
  );
}

export function generateStaticPaths() {
  const tags = allBlogs.flatMap((blog) => blog.tagsAsSlugs ?? []);
  const uniqueTags = [...new Set(tags)];
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
