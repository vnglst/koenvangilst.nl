import { getClient, getClients } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
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

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
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

export async function generateStaticParams() {
  const clients = await getClients();

  return clients.map((client) => {
    return { slug: client.slug };
  });
}
