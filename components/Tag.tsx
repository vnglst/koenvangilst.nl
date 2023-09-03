import React from 'react';
import NextLink from 'next/link';

export function Tag({ tag }: { tag: string }) {
  return (
    <NextLink
      key={tag}
      href={`/blog/tag/${tag}`}
      className="px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:bg-gray-300 hover:text-gray-900"
    >
      {tag.split('-').join(' ')}
    </NextLink>
  );
}
