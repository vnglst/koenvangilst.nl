'use client';

import MetricCard from 'components/metrics/Card';
import fetcher from 'lib/fetcher';
import { Unsplash } from 'lib/types';
import useSWR from 'swr';

export default function UnsplashCard() {
  const { data } = useSWR<Unsplash>('/api/unsplash', fetcher);

  const downloads = Number(data?.downloads);
  const views = Number(data?.views);
  const link = 'https://unsplash.com/@vnglst';

  return (
    <>
      <MetricCard header="Unsplash Downloads" link={link} metric={downloads} />
      <MetricCard header="Unsplash Views" link={link} metric={views} />
    </>
  );
}
