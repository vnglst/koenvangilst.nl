import { getPosts } from 'cms/queries';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';
import { supabase } from 'services/supabase.client';

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
  const posts = await getPosts();

  const sortedPosts = [...posts].sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)));

  // select total views for pathname that starts with /blog/
  const totalViews = await supabase
    .from('totals')
    .select('total')
    .like('pathname', '/blog/%')
    .then(({ data: views }) => views?.reduce((acc, view) => acc + view.total, 0));

  const highlighted = [
    'rising-temperatures',
    'code-colocation-is-king',
    'correspondence-vondel',
    'keeping-code-complexity-in-check',
    'ai-enhanced-learning'
  ];

  const highlightedPosts = sortedPosts.filter((post) => highlighted.includes(post.slug));

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
      <Search posts={sortedPosts} placeholderPosts={highlightedPosts} />
    </Container>
  );
}
