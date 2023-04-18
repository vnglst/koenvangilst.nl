import { getViews, getViewsPerMonth } from 'api/supabase';

import { pick } from 'contentlayer/client';
import { allBlogs } from 'contentlayer/generated';

import { Search } from './search';

export const revalidate = 60 * 60 * 24; // 24 hours

export const metadata = {
  title: 'Blog',
  description: `I've been writing online since 2016, mostly about web development (React & Svelte). In total, I've written ${allBlogs.length} articles on this site.`
};

export default async function Blog() {
  const posts = allBlogs
    .map((post) => pick(post, ['slug', 'title', 'summary', 'publishedAt']))
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    );

  const postsWithViews = await Promise.all(
    posts.map(async (post) => {
      const views = await getViews('/blog/' + post.slug);
      const viewsPerMonth = await getViewsPerMonth('/blog/' + post.slug);
      return { ...post, views, viewsPerMonth: viewsPerMonth };
    })
  );

  const mostPopularPosts = [...postsWithViews]
    .sort((a, b) => b.viewsPerMonth - a.viewsPerMonth)
    .slice(0, 3)
    .sort((a, b) => b.views - a.views);

  return (
    <div className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        Blog
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {`I've been writing online since 2016, mostly about web development (React & Svelte).
          In total, I've written ${posts.length} articles on this site.
          Use the search below to filter by title.`}
      </p>
      <Search posts={postsWithViews} mostPopularPosts={mostPopularPosts} />
    </div>
  );
}
