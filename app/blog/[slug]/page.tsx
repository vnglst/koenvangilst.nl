import { getPost, getPosts } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const post = await getPost(params.slug);

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
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      images: `https://koenvangilst.nl${post.image?.src}`
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vnglst',
      title: post.title,
      description: post.summary,
      images: [post.image?.src]
    },
    alternates: {
      canonical: 'blog/' + post.slug
    }
  };
}

export async function generateStaticParams() {
  return (await getPosts()).map((snippet) => snippet.slug);
}
