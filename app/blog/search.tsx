'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import BlogPost from 'components/BlogPost';
import Icon from 'components/Icon';

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
          <Icon
            icon="spinner"
            className="absolute w-5 h-5 text-gray-400 right-3 top-3 animate-spin dark:text-gray-300"
          />
        ) : (
          <Icon
            icon="search"
            className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
          />
        )}
      </div>
      {!defaultValue && (
        <>
          <h2 className="mt-8 mb-6 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            Popular this month
          </h2>
          {placeholderPosts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
        </>
      )}
      <h2 className="mt-8 mb-6 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
        All Posts
      </h2>
      {searchResults.map((post) => (
        <BlogPost key={post.title} {...post} />
      ))}
      {searchResults.length === 0 && (
        <p className="mb-4 text-gray-600 dark:text-gray-400">No posts found.</p>
      )}
    </>
  );
}
