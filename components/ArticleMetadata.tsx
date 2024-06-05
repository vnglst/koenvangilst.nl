import Image from 'next/image';

import { ViewCount } from './ViewCount';

export function ArticleMetadata({ publishedAt, readingTimeText, path }) {
  return (
    <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
      <div className="flex items-center">
        <Image alt="Koen van Gilst" height={24} width={24} src="/avatar.jpg" className="rounded-full" priority />
        <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {'Koen van Gilst / '}
          {new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <p className="mt-2 min-w-32 text-sm text-gray-600 dark:text-gray-400 md:mt-0">
        {readingTimeText}
        {` • `}
        <ViewCount path={path} />
      </p>
    </div>
  );
}
