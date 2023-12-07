import Link from 'next/link';

import { ViewCount } from './ViewCount';

type BlogPostLinkProps = {
  title: string;
  summary: string;
  slug: string;
  views: number;
};

export function BlogPostLink({
  title,
  summary,
  slug,
  views
}: BlogPostLinkProps) {
  return (
    <Link href={`/blog/${slug}`} className="w-full no-underline">
      <div className="up-hover mb-8 w-full">
        <div className="flex flex-col justify-between md:flex-row">
          <h3 className="mb-2 w-full text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">
            {title}
          </h3>
          <ViewCount
            className="mb-4 w-64 text-left text-gray-500 md:mb-0 md:text-right"
            views={views}
          />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{summary}</p>
      </div>
    </Link>
  );
}
