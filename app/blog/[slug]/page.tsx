import { getPost, getPosts } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  let additionalComponents = {};

  try {
    additionalComponents = await import('data/blog/' + params.slug + '.components.js');
  } catch (e) {
    if (!e || e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
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
      additionalComponents={additionalComponents}
    />
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
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
  const posts = await getPosts();

  return posts.map((snippet) => {
    return {
      slug: snippet.slug
    };
  });
}
