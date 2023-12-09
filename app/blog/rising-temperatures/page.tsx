import { getPost } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';
import { Temperatures } from 'components/Prognose2100/Temperatures';

const SLUG = 'rising-temperatures';

export default async function Page() {
  const post = await getPost(SLUG);

  if (!post) {
    notFound();
  }

  return (
    <MarkdownLayout
      publishedAt={post.publishedAt}
      title={post.title}
      readingTime={post.readingTime}
      tags={post.tags}
      path={'/blog/' + post.slug}
      image={post.image}
      code={post.code}
      additionalComponents={{ Temperatures }}
    />
  );
}

export async function generateMetadata() {
  const post = await getPost(SLUG);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      images: `https://koenvangilst.nl${post.image}`
    },
    alternates: {
      canonical: 'blog/' + post.slug
    }
  };
}
