import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { components } from 'components/MDXComponents';
import { Prose } from 'components/Prose';

import { allClients } from 'contentlayer/generated';

export default function Client({ params }: { params: { slug: string } }) {
  const client = findClientBySlug(params.slug);

  if (!client) {
    notFound();
  }

  const Component = getMDXComponent(client.body.code);

  return (
    <Container>
      <Heading level={1}>{client.name}</Heading>
      <div className="mb-6 mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
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
            {client.year}
          </p>
        </div>
        <p className="min-w-32 mt-2 text-sm text-gray-600 dark:text-gray-400 md:mt-0">
          {client.readingTime.text}
        </p>
      </div>
      <Prose as="section">
        <Component components={components} />
      </Prose>
    </Container>
  );
}

function findClientBySlug(slug: string) {
  return allClients.find((client) => client.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const client = findClientBySlug(params.slug);

  return {
    title: client?.name,
    description: client?.summary,
    alternates: {
      canonical: 'portfolio/' + client?.slug
    }
  };
}

export function generateStaticParams() {
  return allClients.map((client) => client.slug);
}
