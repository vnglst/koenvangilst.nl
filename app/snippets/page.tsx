import SnippetCard from 'components/SnippetCard';

import { pick } from 'contentlayer/client';
import { allSnippets } from 'contentlayer/generated';

export const metadata = {
  title: 'Code Snippets – Koen van Gilst',
  description:
    'A collection of code snippets – including React hooks, TypeScript tips, random CSS snippets and Node.js scripts'
};

export default function Snippets() {
  const snippets = allSnippets.map((snippet) =>
    pick(snippet, ['slug', 'title', 'logo', 'description'])
  );

  return (
    <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        Code Snippets
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {`These are a collection of code snippets I've used in the past and
          saved. They include React hooks, TypeScript tips, random CSS snippets
          and Node.js scripts.`}
      </p>
      <div className="grid w-full grid-cols-1 gap-8 my-2 mt-4 sm:grid-cols-2">
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.slug}
            title={snippet.title}
            slug={snippet.slug}
            logo={snippet.logo}
            description={snippet.description}
          />
        ))}
      </div>
    </article>
  );
}