import components from 'components/MDXComponents';
import { allSnippets } from 'contentlayer/generated';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

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
    <article className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 w-full">
      <div className="flex justify-between w-full mb-8">
        <div>
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
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
            src={`/logos/${snippet.logo}`}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="prose dark:prose-dark w-full">
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
    image: snippet.logo
  };
}
