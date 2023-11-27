import { Suspense } from 'react';

import MetricCard from 'components/Card';
import { getGithubStats } from 'services/github';
import {
  getTotalTodayViews,
  getTotalViews,
  getTotalWeekViews
} from 'services/supabase';
import { getUnsplashStatistics } from 'services/unsplash';
import { Heading } from 'ui/Heading';

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
    <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
      <Heading level={1}>Dashboard</Heading>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is my personal dashboard, built with React Server Components. I
          use this dashboard to track various metrics across platforms like
          Unsplash and GitHub. It also shows daily, weekly & total view counts
          for my website.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
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
    </div>
  );
}
