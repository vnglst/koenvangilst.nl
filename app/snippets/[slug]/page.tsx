import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

import components from 'components/MDXComponents';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';
import { Prose } from 'ui/Prose';

import { allSnippets } from 'contentlayer/generated';

type SnippetPageProps = {
  params: { slug: string };
};

export default function SnippetPage({ params }: SnippetPageProps) {
  const snippet = findSnippet(params.slug);

  if (!snippet) {
    notFound();
  }

  const Component = getMDXComponent(snippet.body.code);

  return (
    <Container>
      <div className="mb-5 flex w-full justify-between">
        <div>
          <Heading level={1}>{snippet.title}</Heading>
          <p className="text-gray-700 dark:text-gray-300">
            {snippet.description}
          </p>
        </div>
        <Image
          alt={snippet.title}
          height={48}
          width={48}
          src={`/static/logos/${snippet.logo}`}
          className="mt-4 aspect-square h-8 w-8 rounded-full md:h-12 md:w-12"
          priority
        />
      </div>
      <Prose as="section">
        <Component components={components} />
      </Prose>
    </Container>
  );
}

function findSnippet(slug: string) {
  return allSnippets.find((snippet) => snippet.slug === slug);
}

export function generateMetadata({ params }) {
  const snippet = findSnippet(params.slug);

  if (!snippet) {
    return null;
  }

  return {
    title: snippet.title,
    description: snippet.description,
    image: snippet.logo,
    alternates: {
      canonical: 'snippets/' + snippet.slug
    }
  };
}

export function generateStaticParams() {
  return allSnippets.map((snippet) => snippet.slug);
}
