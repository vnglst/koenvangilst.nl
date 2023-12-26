import Link from 'next/link';

import { ViewCount } from './ViewCount';

type BlogPostLinkProps = {
  title: string;
  summary: string;
  slug: string;
};

export function BlogPostLink({ title, summary, slug }: BlogPostLinkProps) {
  const path = `/blog/${slug}`;

  return (
    <Link href={path} className="w-full no-underline">
      <div className="up-hover w-full">
        <div className="flex flex-col justify-between md:flex-row">
          <h3 className="mb-2 w-full text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
            {title}
          </h3>
          <ViewCount
            path={path}
            className="mb-4 w-64 text-left text-gray-500 md:mb-0 md:text-right"
          />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{summary}</p>
      </div>
    </Link>
  );
}
