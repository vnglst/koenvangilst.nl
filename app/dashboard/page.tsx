import { PropsWithChildren, Suspense } from 'react';
import NextLink from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { VisitsVisual } from 'components/VisitsVisual';
import { getGithubStats } from 'services/github';
import { getUnsplashStatistics } from 'services/unsplash';
import { getTotalViews, getViewsPerDay } from 'services/views';

export const metadata = {
  title: 'Dashboard',
  description: 'My personal dashboard, built with Next.js API routes deployed as serverless functions.',
  alternates: {
    canonical: 'dashboard'
  }
};

export default async function Dashboard() {
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
          This is my personal dashboard, built with React Server Components. I use this dashboard to track various
          metrics across platforms like Unsplash and GitHub. It also shows daily, weekly & total view counts for my
          website.
        </p>
      </div>
      <div className="mb-4 mt-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard header="Unsplash Downloads" link={link} metric={unsplashDownloads} />
        <MetricCard header="Unsplash Views" link={unsplashLink} metric={unsplashViews} />
        <MetricCard header="GitHub Stars" link={link} metric={githubStars} />
        <Suspense fallback={<RealTimeMetricsPlaceholder />}>
          <RealTimeMetrics />
        </Suspense>
      </div>
      <Suspense>
        <VisualContainer />
      </Suspense>
    </Container>
  );
}

type Props = {
  header?: string;
  link?: string;
  metric?: number;
};

async function MetricCard({ header, link, metric }: Props) {
  const className = 'min-h-[102px] border border-dashed border-gray-400 p-4 w-full text-gray-900 dark:text-gray-100';

  // Show placeholder if props are missing
  if (!metric || !header || !link) return <div className={className} />;

  const isExternalLink = link.startsWith('https://');

  const Link = isExternalLink ? ExternalLink : NextLink;

  return (
    <Link className={className} href={link}>
      <div className="up-hover">
        <div className="flex items-center">
          {header} {isExternalLink ? <Icon icon="external-link" className="ml-auto h-4 w-4" /> : null}
        </div>
        <p className="spacing-sm mt-2 text-3xl font-bold text-black dark:text-white">
          {metric > 0 ? metric.toLocaleString() : '-'}
        </p>
      </div>
    </Link>
  );
}

function ExternalLink({ href, className, children }: PropsWithChildren<{ href: string; className: string }>) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={href} className={className}>
      {children}
    </a>
  );
}

function RealTimeMetricsPlaceholder() {
  return <MetricCard />;
}

async function RealTimeMetrics() {
  const totalViews = await getTotalViews();

  return <MetricCard header="Total Website Views" metric={totalViews} link="/dashboard/stats" />;
}

async function VisualContainer() {
  const visits = await getViewsPerDay(365);
  return <VisitsVisual visits={visits} />;
}
