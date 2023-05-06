'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import BlogPost from 'components/BlogPost';

import { Blog } from 'contentlayer/generated';

type Post = Pick<Blog, 'slug' | 'title' | 'summary' | 'publishedAt'> & {
  views: number;
};

type SearchProps = {
  searchResults: Post[];
  placeholderPosts: Post[];
  defaultValue?: string;
};

export function Search({
  searchResults,
  placeholderPosts,
  defaultValue
}: SearchProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value;
    let params = new URLSearchParams(window.location.search);

    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }

    startTransition(() => replace(pathname + '?' + params.toString()));
  }

  return (
    <>
      <div className="relative w-full mb-4">
        <input
          aria-label="Search articles"
          type="text"
          defaultValue={defaultValue}
          onChange={handleSearch}
          placeholder="Search articles"
          className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-md dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
        {isPending ? (
          <svg
            className="absolute animate-spin w-5 h-5 right-3 top-3 text-gray-500 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="11"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
      {!defaultValue && (
        <>
          <h3 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            Popular this month
          </h3>
          {placeholderPosts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
        </>
      )}
      <h3 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
        All Posts
      </h3>
      {searchResults.map((post) => (
        <BlogPost key={post.title} {...post} />
      ))}
      {searchResults.length === 0 && (
        <p className="mb-4 text-gray-600 dark:text-gray-400">No posts found.</p>
      )}
    </>
  );
}
