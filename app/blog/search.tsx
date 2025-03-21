'use client';

import { useState } from 'react';

import { Icon } from 'components/Icon';
import { BlogPostLink } from 'components/PostLink';

type Post = {
  title: string;
  summary: string;
  tags: string[];
  slug: string;
};

type SearchProps = {
  posts: Post[];
};

export function Search({ posts }: SearchProps) {
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
      <div className="relative my-4 w-full">
        <input
          aria-label="Search articles"
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search articles"
          className="block w-full rounded-none border border-dashed border-gray-400 p-6 px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-black dark:bg-gray-800 dark:text-gray-100"
        />
        <Icon icon="search" className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300" />
      </div>
      <div className="mt-8 flex flex-col gap-6">
        {!query ? (
          posts.map((post) => <BlogPostLink key={post.title} {...post} />)
        ) : (
          <>
            {searchResults.map((post) => (
              <BlogPostLink key={post.title} {...post} />
            ))}
            {searchResults.length === 0 && <p className="mb-4 text-gray-600 dark:text-gray-400">No posts found.</p>}
          </>
        )}
      </div>
    </>
  );
}
