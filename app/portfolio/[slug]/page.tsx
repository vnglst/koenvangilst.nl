import { getClient } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { slug: string };
};

export default async function Page({ params }: PageProps) {
  const client = await getClient(params.slug);

  if (!client) {
    notFound();
  }

  return (
    <MarkdownLayout
      publishedAt={client.year.toString()}
      title={client.name}
      readingTime={client.readingTime}
      path={'/portfolio/' + client.slug}
      code={client.code}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const client = await getClient(params.slug);

  if (!client) {
    return notFound();
  }

  return {
    title: client?.name,
    description: client?.summary,
    alternates: {
      canonical: 'portfolio/' + client?.slug
    }
  };
}
