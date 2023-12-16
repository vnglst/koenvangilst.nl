import { getSnippets } from 'cms/queries';
import Image from 'next/image';
import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';
import { getViews } from 'services/supabase';

export const revalidate = 60;

export const metadata = {
  title: 'Code Snippets – Koen van Gilst',
  description:
    'A collection of code snippets – including React hooks, TypeScript tips, random CSS snippets and Node.js scripts'
};

export default async function Snippets() {
  const snippets = await getSnippets();

  const snippetsWithViews = await Promise.all(
    snippets.map(async (post) => {
      const views = await getViews('/snippets/' + post.slug);
      return { ...post, views };
    })
  );

  const mostPopular = snippetsWithViews.sort((a, b) => b.views - a.views);

  return (
    <Container>
      <Prose>
        <Heading level={1}>Code Snippets</Heading>
        <p>
          These are a collection of code snippets I've used in the past and
          saved. They include React hooks, TypeScript tips, random CSS snippets
          and Node.js scripts.
        </p>
      </Prose>
      <div className="my-2 mt-4 grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
        {mostPopular.map((snippet) => (
          <SnippetLink
            key={snippet.slug}
            title={snippet.title}
            slug={snippet.slug}
            logo={snippet.logo}
            description={snippet.description}
            views={snippet.views}
          />
        ))}
      </div>
    </Container>
  );
}

function SnippetLink({ title, description, slug, logo, views, ...rest }) {
  return (
    <Link
      href={`/snippets/${slug}`}
      className="up-hover w-full rounded-xl border border-dashed border-gray-400 bg-gray-50 p-4 dark:bg-black"
      {...rest}
    >
      <div className="flex content-baseline justify-between">
        <Image
          alt={title}
          height={32}
          width={32}
          src={`/static/logos/${logo}`}
          className="rounded-full"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {views} views
        </span>
      </div>
      <h3 className="mt-2 text-left text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-gray-700 dark:text-gray-400">{description}</p>
    </Link>
  );
}
