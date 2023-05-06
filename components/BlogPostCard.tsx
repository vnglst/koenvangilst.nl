import Link from 'next/link';

import { getViews } from 'services/supabase';

import Icon from './Icon';
import { ViewCount } from './ViewCount';

export default async function BlogPostCard({ title, slug }) {
  const views = await getViews('/blog/' + slug);

  return (
    <Link
      href={`/blog/${slug}`}
      className="rounded-xl w-full md:w-1/3 p-6 bg-gray-50 dark:bg-black border-dashed border-gray-400 border flex flex-col justify-between up-hover"
    >
      <h4 className="text-lg md:text-lg font-medium mb-6 sm:mb-10 w-full text-gray-900 dark:text-gray-100 tracking-tight">
        {title}
      </h4>
      <div className="flex items-center text-gray-800 dark:text-gray-200 capsize">
        <Icon icon="eye" className="h-6 w-6" />
        <ViewCount
          className="ml-2 align-baseline capsize"
          initialCount={views}
          path={`/blog/${slug}`}
        />
      </div>
    </Link>
  );
}
