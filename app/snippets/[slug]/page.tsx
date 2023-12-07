import { getSnippet } from 'cms/queries';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { MDXComponent } from 'components/MDXComponent';
import { Prose } from 'components/Prose';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { slug: string };
};

export default async function Page({ params }: PageProps) {
  const snippet = await getSnippet(params.slug);

  if (!snippet) {
    notFound();
  }

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
        <MDXComponent code={snippet.code} />
      </Prose>
    </Container>
  );
}

export async function generateMetadata({ params }) {
  const snippet = await getSnippet(params.slug);

  if (!snippet) {
    return notFound;
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
