import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Container } from '#/components/layout/Container';
import { PageHeader } from '#/components/layout/PageHeader';
import { Prose } from '#/components/content/Prose';
import { ProjectBrowser } from './_components/project-browser';

const getLabPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const { getPosts } = await import('#/cms/posts-server');
  return getPosts();
});

export const Route = createFileRoute('/lab/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : undefined
  }),
  loader: () => getLabPosts(),
  head: () => ({
    meta: [
      { title: 'Lab | Koen van Gilst' },
      {
        name: 'description',
        content: "Koen van Gilst's coding laboratory, a collection of coding experiments, articles, and side projects."
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://koenvangilst.nl/lab' },
      { property: 'og:title', content: 'Lab | Koen van Gilst' },
      { property: 'og:description', content: 'A collection of coding experiments, articles, and side projects.' },
      { name: 'twitter:card', content: 'summary' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/lab' }]
  }),
  component: Labs
});

function Labs() {
  const posts = Route.useLoaderData();

  return (
    <Container>
      <PageHeader title="Articles & Side Projects" />
      <Prose className="lab-introduction">
        <p>
          Articles about software, AI, and things I've learned. Explore Side projects for apps, games, and experiments
          I've built.
        </p>
      </Prose>
      <ProjectBrowser projects={posts} />
    </Container>
  );
}
