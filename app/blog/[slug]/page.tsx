import { format, parseISO } from 'date-fns';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { components } from 'components/MDXComponents';
import { Prose } from 'components/Prose';
import { Tag } from 'components/Tag';
import { ViewCount } from 'components/ViewCount';
import { getViews } from 'services/supabase';

import { allBlogs } from 'contentlayer/generated';

export const revalidate = 60 * 30;

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
    <Container>
      <Heading level={1}>{post.title}</Heading>
      <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
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
        <p className="min-w-32 mt-2 text-sm text-gray-600 dark:text-gray-400 md:mt-0">
          {post.readingTime.text}
          {` • `}
          <ViewCount initialCount={views} path={`/blog/${post.slug}`} />
        </p>
      </div>
      {post.tagsAsSlugs && (
        <ul className="my-4 flex w-full flex-wrap gap-2">
          {post.tagsAsSlugs.map((tag: string) => (
            <li key={tag}>
              <Tag tag={tag} />
            </li>
          ))}
        </ul>
      )}
      <Prose as="section">
        {post.image && post.image.showAsHeader ? (
          <Image
            alt={post.image.alt}
            src={post.image.src}
            width={post.image.width}
            height={post.image.height}
            className="inline-block rounded-lg"
            priority
          />
        ) : null}
        <Component components={components} />
      </Prose>
      <footer className="mt-8 text-sm text-gray-700 dark:text-gray-300">
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
    </Container>
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
