import { useState } from 'react';

import Container from 'components/Container';
import BlogPost from 'components/BlogPost';
import { InferGetStaticPropsType } from 'next';
import { pick } from 'lib/utils';
import { allBlogs } from '.contentlayer/data';

export default function Blog({
  posts
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchValue, setSearchValue] = useState('');
  const filteredBlogPosts = posts
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .filter((post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <Container
      title="Blog – Koen van Gilst"
      description={`I've been writing online since 2016, mostly about web development (React & Svelte).
    In total, I've written ${posts.length} articles on this site.`}
    >
      <div className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          Blog
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {`I've been writing online since 2016, mostly about web development (React & Svelte).
            In total, I've written ${posts.length} articles on this site.
            Use the search below to filter by title.`}
        </p>
        <div className="relative w-full mb-4">
          <input
            aria-label="Search articles"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search articles"
            className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-md dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
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
        </div>
        {!searchValue && (
          <>
            <h3 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
              Most Popular
            </h3>
            <BlogPost
              title="Using Svelte to create a scroll video effect"
              summary="Tutorial on how to create a scroll video effect using Svelte’s powerful bind command."
              slug="tutorial-svelte-scroll-video"
            />
            <BlogPost
              title="Code Colocation is King"
              summary="A simple principle to help structure code better."
              slug="code-colocation-is-king"
            />
            <BlogPost
              title="Using React Hooks with canvas"
              summary="An intro to the React hooks useState, useRef and useEffect."
              slug="react-hooks-with-canvas"
            />
          </>
        )}
        <h3 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
          All Posts
        </h3>
        {!filteredBlogPosts.length && (
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            No posts found.
          </p>
        )}
        {filteredBlogPosts.map((post) => (
          <BlogPost key={post.title} {...post} />
        ))}
      </div>
    </Container>
  );
}

export function getStaticProps() {
  const posts = allBlogs.map((post) =>
    pick(post, ['slug', 'title', 'summary', 'publishedAt'])
  );

  return { props: { posts } };
}
