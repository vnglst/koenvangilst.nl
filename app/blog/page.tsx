import { getPosts } from 'cms/queries';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';
import { getViews, getViewsPerMonth } from 'services/views';

import { Search } from './search';

export async function generateMetadata() {
  const posts = await getPosts();

  return {
    alternates: {
      canonical: 'blog'
    },
    title: 'Blog',
    description: `I've been writing online since 2016, mostly about web development (React & Svelte). In total, I've written ${posts.length} articles on this site.`
  };
}

export default async function Blog() {
  const sortedPosts = [...(await getPosts())].sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  );

  const postsWithViews = await Promise.all(
    sortedPosts.map(async (post) => {
      const views = await getViews('/blog/' + post.slug);
      const viewsPerMonth = await getViewsPerMonth('/blog/' + post.slug);
      return { ...post, views, viewsPerMonth: viewsPerMonth };
    })
  );

  const totalViews = postsWithViews.reduce((acc, post) => acc + post.views, 0);

  const highlighted = [
    'rising-temperatures',
    'code-colocation-is-king',
    'correspondence-vondel',
    'keeping-code-complexity-in-check',
    'ai-enhanced-learning'
  ];
  const highlightedPosts = postsWithViews.filter((post) => highlighted.includes(post.slug));

  return (
    <Container>
      <Prose>
        <Heading level={1}>Blog</Heading>
        <p>
          I've been writing online since 2016, mostly about web development. In total, I've written {sortedPosts.length}{' '}
          articles on this site. Use the search below to filter by title. They've been viewed a total of{' '}
          {totalViews.toLocaleString()} times.
        </p>
      </Prose>
      <Search posts={postsWithViews} placeholderPosts={highlightedPosts} />
    </Container>
  );
}
