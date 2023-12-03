import Link from 'next/link';

import { getViews } from 'services/supabase';
import Icon from 'ui/Icon';

import { ViewCount } from './ViewCount';

export async function FeaturedCard({ title, slug }) {
  const views = await getViews('/blog/' + slug);

  return (
    <Link
      href={`/blog/${slug}`}
      className="up-hover flex w-full flex-col justify-between rounded-xl border border-dashed border-gray-400 bg-gray-50 p-6 dark:bg-black md:w-1/3"
    >
      <h4 className="mb-6 w-full text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100 sm:mb-10 md:text-lg">
        {title}
      </h4>
      <div className="capsize flex items-center text-gray-800 dark:text-gray-200">
        <Icon icon="eye" className="h-6 w-6" />
        <ViewCount
          className="capsize ml-2 align-baseline"
          initialCount={views}
          path={`/blog/${slug}`}
        />
      </div>
    </Link>
  );
}
