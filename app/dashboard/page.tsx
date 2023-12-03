import { PropsWithChildren, Suspense } from 'react';
import NextLink from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import Icon from 'components/Icon';
import { getGithubStats } from 'services/github';
import {
  getTotalTodayViews,
  getTotalViews,
  getTotalWeekViews
} from 'services/supabase';
import { getUnsplashStatistics } from 'services/unsplash';

export const metadata = {
  title: 'Dashboard',
  description:
    'My personal dashboard, built with Next.js API routes deployed as serverless functions.',
  alternates: {
    canonical: 'dashboard'
  }
};

export default async function Dashboard() {
  const todaysViews = getTotalTodayViews();
  const weekViews = getTotalWeekViews();
  const totalViews = getTotalViews();

  const unsplash = await getUnsplashStatistics();
  const unsplashDownloads = Number(unsplash?.downloads);
  const unsplashViews = Number(unsplash?.views);
  const unsplashLink = 'https://unsplash.com/@vnglst';

  const github = await getGithubStats();
  const githubStars = Number(github?.stars);
  const link = 'https://github.com/vnglst';

  return (
    <Container>
      <Heading level={1}>Dashboard</Heading>
      <div className="mb-8">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This is my personal dashboard, built with React Server Components. I
          use this dashboard to track various metrics across platforms like
          Unsplash and GitHub. It also shows daily, weekly & total view counts
          for my website.
        </p>
      </div>
      <div className="my-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          header="Unsplash Downloads"
          link={link}
          metric={unsplashDownloads}
        />
        <MetricCard
          header="Unsplash Views"
          link={unsplashLink}
          metric={unsplashViews}
        />
        <MetricCard header="GitHub Stars" link={link} metric={githubStars} />
        <Suspense>
          <MetricCard
            header="Daily Website Views"
            metric={todaysViews}
            link="/dashboard/alltime"
          />
          <MetricCard
            header="Weekly Website Views"
            metric={weekViews}
            link="/dashboard/alltime"
          />
          <MetricCard
            header="Total Website Views"
            metric={totalViews}
            link="/dashboard/stats"
          />
        </Suspense>
      </div>
    </Container>
  );
}

type Props = {
  header: string;
  link: string;
  metric: number | Promise<number>;
};

async function MetricCard({ header, link, metric }: Props) {
  const isExternalLink = link.startsWith('https://');
  const metricNumber = await metric;

  const className =
    'bg-white dark:bg-gray-900 border border-dashed border-gray-400 rounded-lg p-4 max-w-72 w-full text-gray-900 dark:text-gray-100';

  const Link = isExternalLink ? ExternalLink : NextLink;

  return (
    <Link className={className} href={link}>
      <div className="flex items-center">
        {header}
        {isExternalLink ? (
          <Icon icon="external-link" className="ml-1 h-4 w-4" />
        ) : null}
      </div>
      <p className="spacing-sm mt-2 text-3xl font-bold text-black dark:text-white">
        {metricNumber > 0 ? metricNumber.toLocaleString() : '-'}
      </p>
    </Link>
  );
}

function ExternalLink({
  href,
  className,
  children
}: PropsWithChildren<{ href: string; className: string }>) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={className}
    >
      {children}
    </a>
  );
}
