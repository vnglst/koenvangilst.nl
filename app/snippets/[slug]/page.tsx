import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer/hooks';
import components from 'components/MDXComponents';
import { allSnippets } from 'contentlayer/generated';
import { notFound } from 'next/navigation';

type SnippetPageProps = {
  params: { slug: string };
};

export default function SnippetPage({ params }: SnippetPageProps) {
  const snippet = allSnippets.find((snippet) => snippet.slug === params.slug);

  if (!snippet) {
    notFound();
  }

  const Component = useMDXComponent(snippet.body.code);

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
        <Component components={components as any} />
      </div>
    </article>
  );
}

// TODO: Investigate error Dynamic server usage: headers
// It seems that when using cookies and headers server side pages cannot be statically generated.
// Investigate if this is bad for performance or not.

// export async function generateStaticParams() {
//   return allSnippets.map((s) => ({ params: { slug: s.slug } }));
// }
