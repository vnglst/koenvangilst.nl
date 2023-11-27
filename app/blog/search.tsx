'use client';

import { useState } from 'react';

import BlogPost from 'components/BlogPost';
import Icon from 'ui/Icon';

import { Blog } from 'contentlayer/generated';

type Post = Pick<
  Blog,
  'slug' | 'title' | 'summary' | 'publishedAt' | 'tags'
> & {
  views: number;
};

type SearchProps = {
  posts: Post[];
  placeholderPosts: Post[];
};

export function Search({ posts, placeholderPosts }: SearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value;

    setQuery(searchValue);

    const result = posts.filter(
      (post) =>
        post.title.match(new RegExp(searchValue, 'i')) ||
        post.summary.match(new RegExp(searchValue, 'i')) ||
        post.tags.some((tag) => tag.match(new RegExp(searchValue, 'i')))
    );

    setSearchResults(result);
  }

  return (
    <>
      <div className="relative w-full my-4">
        <input
          aria-label="Search articles"
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search articles"
          className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-md dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
        <Icon
          icon="search"
          className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
        />
      </div>
      {!query ? (
        <>
          <h2 className="mt-8 mb-6 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            Popular this month
          </h2>
          {placeholderPosts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
          <h2 className="mt-8 mb-6 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            All Posts
          </h2>
          {posts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
        </>
      ) : (
        <>
          <h2 className="mt-8 mb-6 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            Search result
          </h2>
          {searchResults.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
          {searchResults.length === 0 && (
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              No posts found.
            </p>
          )}
        </>
      )}
    </>
  );
}
