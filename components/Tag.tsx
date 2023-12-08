import React from 'react';
import NextLink from 'next/link';

import { sluggify } from 'lib/sluggify';

type TagProps = {
  tag: string;
};

export function Tag({ tag }: TagProps) {
  return (
    <NextLink
      key={tag}
      href={`/blog/tag/${sluggify(tag)}`}
      className="rounded bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 no-underline hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200"
    >
      {tag}
    </NextLink>
  );
}
