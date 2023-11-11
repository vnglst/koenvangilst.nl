import { format, parseISO } from 'date-fns';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

import components from 'components/MDXComponents';
import { Tag } from 'components/Tag';
import { ViewCount } from 'components/ViewCount';
import { getViews } from 'services/supabase';

import { allBlogs } from 'contentlayer/generated';

export const revalidate = 60 * 30; // 30 min

type PostProps = {
  params: { slug: string };
};

export default async function Post({ params }: PostProps) {
  const post = allBlogs.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const views = await getViews('/blog/' + post.slug);

  const Component = getMDXComponent(post.body.code);

  return (
    <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16 break-words">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        {post.title}
      </h1>
      <div className="flex flex-col items-start justify-between w-full mt-2 md:flex-row md:items-center">
        <div className="flex items-center">
          <Image
            alt="Koen van Gilst"
            height={24}
            width={24}
            src="/avatar.jpg"
            className="rounded-full"
            priority
          />
          <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {'Koen van Gilst / '}
            {format(parseISO(post.publishedAt), 'MMMM dd, yyyy')}
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 min-w-32 md:mt-0">
          {post.readingTime.text}
          {` • `}
          <ViewCount initialCount={views} path={`/blog/${post.slug}`} />
        </p>
      </div>
      {post.tagsAsSlugs && (
        <ul className="flex flex-wrap w-full mt-4 gap-2">
          {post.tagsAsSlugs.map((tag: string) => (
            <li key={tag}>
              <Tag tag={tag} />
            </li>
          ))}
        </ul>
      )}
      <section className="w-full prose dark:prose-dark max-w-none">
        {post.image && post.image.showAsHeader ? (
          <Image
            alt={post.image.alt}
            src={post.image.src}
            width={post.image.width}
            height={post.image.height}
            className="my-0 rounded-lg inline-block"
            priority
          />
        ) : null}
        <Component components={components} />
      </section>
      <footer className="text-sm text-gray-700 dark:text-gray-300 mt-8">
        <a
          href={getDiscussUrl(post.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {'Discuss on Twitter'}
        </a>
        {` • `}
        <a
          href={getEditUrl(post.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {'Edit on GitHub'}
        </a>
      </footer>
    </article>
  );
}

function findBlog(slug: string) {
  return allBlogs.find((blog) => blog.slug === slug);
}

function getEditUrl(slug: string) {
  return `https://github.com/vnglst/koenvangilst.nl/edit/main/data/blog/${slug}.mdx`;
}

function getDiscussUrl(slug: string) {
  return `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `https://koenvangilst.nl/blog/${slug}`
  )}`;
}

export function generateMetadata({ params }): Metadata {
  const blog = findBlog(params.slug);

  if (!blog) {
    return {};
  }

  const images = blog.image
    ? [
        {
          url: blog.image.src,
          width: blog.image.width,
          height: blog.image.height
        }
      ]
    : [];

  return {
    title: blog.title,
    description: blog.summary,
    twitter: {
      card: 'summary_large_image',
      site: '@vnglst',
      title: blog.title,
      description: blog.summary,
      images: blog.image ? [blog.image.src] : []
    },
    openGraph: {
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: ['Koen van Gilst'],
      images
    },
    alternates: {
      canonical: 'blog/' + blog.slug
    }
  };
}

export function generateStaticParams() {
  return allBlogs.map((blog) => blog.slug);
}
