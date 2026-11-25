import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { getSideProjects } from '#/cms/side-projects';
import { getLegacyRedirect } from '#/lib/legacy-redirect';
import { Container } from '#/components/layout/Container';
import { PageHeader } from '#/components/layout/PageHeader';
import { Prose } from '#/components/content/Prose';
import { ArchiveByYear } from '#/components/content/ArchiveByYear';

const getLabPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const { getPosts } = await import('#/cms/posts-server');
  return getSideProjects(getPosts()).map((project) => ({ ...project, slug: project.url }));
});

export const Route = createFileRoute('/lab/')({
  // The Lab used to list articles too; old filter links (client-side) move to the matching page.
  beforeLoad: ({ location }) => {
    const target = getLegacyRedirect(location.pathname, location.searchStr);
    if (target) throw redirect({ href: target.location, statusCode: target.status });
  },
  loader: () => getLabPosts(),
  head: () => ({
    meta: [
      { title: 'Lab | Koen van Gilst' },
      {
        name: 'description',
        content: "Koen van Gilst's coding laboratory: apps, games, and experiments he has built."
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://koenvangilst.nl/lab' },
      { property: 'og:title', content: 'Lab | Koen van Gilst' },
      { property: 'og:description', content: 'Apps, games, and experiments I have built.' },
      { name: 'twitter:card', content: 'summary' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/lab' }]
  }),
  component: Lab
});

function Lab() {
  const projects = Route.useLoaderData();

  return (
    <Container>
      <PageHeader title="Lab" />
      <Prose>
        <p>Apps, games, and experiments I've built.</p>
      </Prose>
      <ArchiveByYear entries={projects} />
    </Container>
  );
}
