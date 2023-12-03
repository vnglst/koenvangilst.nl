import { getViews, getViewsPerMonth } from 'services/supabase';
import { Prose } from 'ui/Prose';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';

import { pick } from 'contentlayer/client';
import { allBlogs } from 'contentlayer/generated';

import { Search } from './search';

export const revalidate = 60 * 30;

export const metadata = {
  alternates: {
    canonical: 'blog'
  },
  title: 'Blog',
  description: `I've been writing online since 2016, mostly about web development (React & Svelte). In total, I've written ${allBlogs.length} articles on this site.`
};

export default async function Blog() {
  const posts = allBlogs
    .map((post) =>
      pick(post, ['slug', 'title', 'summary', 'publishedAt', 'tags'])
    )
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
    .slice(0, 6);

  const totalViews = postsWithViews.reduce((acc, post) => acc + post.views, 0);

  return (
    <Container>
      <Prose>
        <Heading level={1}>Blog</Heading>
        {`I've been writing online since 2016, mostly about web development.
          In total, I've written ${posts.length} articles on this site.
          Use the search below to filter by title. They've been viewed a total of ${totalViews.toLocaleString()} times.`}
      </Prose>
      <Search posts={postsWithViews} placeholderPosts={mostPopularPosts} />
    </Container>
  );
}
