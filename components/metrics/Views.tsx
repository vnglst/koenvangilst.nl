import useSWR from 'swr';

import fetcher from 'lib/fetcher';
import MetricCard from 'components/metrics/Card';

export default function Views() {
  const { data: todaysViews } = useSWR<any>('/api/views/today', fetcher);
  const { data: weekViews } = useSWR<any>('/api/views/week', fetcher);
  const { data: totalViews } = useSWR<any>('/api/views/all', fetcher);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
      <MetricCard header="Daily Views" metric={todaysViews} />
      <MetricCard header="Weekly Views" metric={weekViews} />
      <MetricCard header="Total Views" metric={totalViews} />
    </div>
  );
}
