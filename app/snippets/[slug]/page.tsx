import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

import components from 'components/MDXComponents';

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
    <article className="mx-auto mb-16 flex w-full max-w-2xl flex-col items-start justify-center">
      <div className="mb-8 flex w-full justify-between">
        <div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
            {snippet.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {snippet.description}
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <Image
            alt={snippet.title}
            height={48}
            width={48}
            src={`/static/logos/${snippet.logo}`}
            className="rounded-full"
            priority
          />
        </div>
      </div>
      <div className="prose w-full dark:prose-dark">
        <Component components={components} />
      </div>
    </article>
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
