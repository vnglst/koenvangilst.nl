import Link from 'next/link';

import type { Blog } from 'contentlayer/generated';

import { ViewCount } from './ViewCount';

type BlogPostProps = Pick<Blog, 'title' | 'summary' | 'slug'> & {
  views?: number;
};

export default function BlogPost({
  title,
  summary,
  slug,
  views
}: BlogPostProps) {
  return (
    <Link href={`/blog/${slug}`} className="w-full no-underline">
      <div className="up-hover mb-8 w-full">
        <div className="flex flex-col justify-between md:flex-row">
          <h3 className="mb-2 w-full text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">
            {title}
          </h3>
          <ViewCount
            className="mb-4 w-64 text-left text-gray-500 md:mb-0 md:text-right"
            initialCount={views}
            path={`/blog/${slug}`}
          />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{summary}</p>
      </div>
    </Link>
  );
}
