import { getPost, getPosts } from 'cms/mdx-parser';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/content/MarkdownLayout';

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
    additionalComponents = await import('content/' + params.slug + '.components.js');
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
      path={'/' + post.slug}
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

  // Generate dynamic OG image with post details
  const ogImageUrl = `https://koenvangilst.nl/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.summary)}&type=blog`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vnglst',
      title: post.title,
      description: post.summary,
      images: [ogImageUrl]
    },
    alternates: {
      canonical: `https://koenvangilst.nl/lab/${post.slug}`
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
