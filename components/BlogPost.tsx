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
    <Link href={`/blog/${slug}`} className="w-full">
      <div className="w-full mb-8">
        <div className="flex flex-col justify-between md:flex-row">
          <h3 className="w-full mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
            {title}
          </h3>
          <ViewCount
            className="w-64 mb-4 text-left text-gray-500 md:text-right md:mb-0"
            initialCount={views}
            path={`/blog/${slug}`}
          />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{summary}</p>
      </div>
    </Link>
  );
}
