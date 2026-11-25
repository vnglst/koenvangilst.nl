import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Container } from '#/components/layout/Container';
import { PageHeader } from '#/components/layout/PageHeader';
import { Prose } from '#/components/content/Prose';
import { ArticleList } from './_components/article-list';

const getArticles = createServerFn({ method: 'GET' }).handler(async () => {
  const { getPosts } = await import('#/cms/posts-server');
  return getPosts()
    .filter((post) => post.tags.includes('article'))
    .map(({ title, summary, tags, slug, publishedAt, url }) => ({ title, summary, tags, slug, publishedAt, url }));
});

export const Route = createFileRoute('/articles/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : undefined
  }),
  loader: () => getArticles(),
  head: () => ({
    meta: [
      { title: 'Articles | Koen van Gilst' },
      { name: 'description', content: 'Articles by Koen van Gilst about software, AI, and things he has learned.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://koenvangilst.nl/articles' },
      { property: 'og:title', content: 'Articles | Koen van Gilst' },
      { property: 'og:description', content: 'Articles about software, AI, and things I have learned.' },
      { name: 'twitter:card', content: 'summary' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/articles' }]
  }),
  component: Articles
});

function Articles() {
  const articles = Route.useLoaderData();

  return (
    <Container>
      <PageHeader title="Articles" />
      <Prose>
        <p>Software, AI, and things I've learned.</p>
      </Prose>
      <ArticleList articles={articles} />
    </Container>
  );
}
