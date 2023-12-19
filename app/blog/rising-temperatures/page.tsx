import { getPost } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';
import { TemperatureAnomalies } from 'components/Prognose2100/TempAnomalies.server';
import { TemperatureHeatmap } from 'components/Prognose2100/TempHeatmap.server';

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
      additionalComponents={{
        TemperatureAnomalies,
        TemperatureHeatmap
      }}
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
