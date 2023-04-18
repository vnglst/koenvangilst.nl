'use client';

import useSWR from 'swr';

import MetricCard from 'components/metrics/Card';
import fetcher from 'lib/fetcher';
import { GitHub } from 'lib/types';

export default function GitHubCard() {
  const { data } = useSWR<GitHub>('/api/github', fetcher);

  const stars = Number(data?.stars);
  const link = 'https://github.com/vnglst';

  return (
    <MetricCard
      header="GitHub Stars"
      link={link}
      metric={stars}
      isCurrency={false}
    />
  );
}
