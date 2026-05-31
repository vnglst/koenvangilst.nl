import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Container } from '#/components/layout/Container';
import { Heading } from '#/components/content/Heading';
import { Prose } from '#/components/content/Prose';
import { Link } from '#/components/ui/Link';
import { dateFormatter } from '#/lib/formatters';

const getRecentArticles = createServerFn({ method: 'GET' }).handler(async () => {
  const { getPosts } = await import('#/cms/posts-server');
  return getPosts()
    .filter((post) => post.tags.includes('article'))
    .slice(0, 5);
});

export const Route = createFileRoute('/')({
  loader: () => getRecentArticles(),
  head: () => ({
    meta: [
      { title: 'Koen van Gilst' },
      {
        name: 'description',
        content:
          'Tech Lead at Rabobank with a background in philosophy and lifelong passion for programming. I focus on AI, team building, and bridging business with technology to deliver real value.'
      }
    ]
  }),
  component: Home
});

function Home() {
  const recentArticles = Route.useLoaderData();

  return (
    <Container>
      <Heading level={1}>Koen van Gilst</Heading>
      <Prose className="mb-4">
        <p>
          I'm a software engineer with a philosophy degree and a lifelong passion for creating software. I started
          programming at an early age using GW-Basic and Turbo Pascal, and even though I've had many more interests, my
          fascination for making computers do "cool stuff" has never faded. After many years as a web developer, I'm now
          in a technical leadership role helping teams build AI solutions for Rabobank.
        </p>
      </Prose>

      <p className="mt-8 mb-4 text-base font-bold text-gray-900 dark:text-gray-100">Recent articles</p>

      <section>
        <ul className="space-y-2">
          {recentArticles.map((article) => (
            <li
              key={article.slug}
              className="flex items-baseline gap-3 overflow-hidden text-base text-gray-900 dark:text-gray-100"
            >
              <span className="w-24 shrink-0 text-gray-600 tabular-nums dark:text-gray-400">
                {dateFormatter(article.publishedAt)}
              </span>
              <Link className="min-w-0 flex-1 truncate font-normal" href={article.url || `/lab/${article.slug}`}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
