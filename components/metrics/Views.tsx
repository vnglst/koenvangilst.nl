import useSWR from 'swr';

import fetcher from 'lib/fetcher';
import MetricCard from 'components/metrics/Card';

export default function Views() {
  const { data: todaysViews } = useSWR<any>('/api/views/today', fetcher);
  const { data: weekViews } = useSWR<any>('/api/views/week', fetcher);
  const { data: totalViews } = useSWR<any>('/api/views/all', fetcher);

  return (
    <>
      <MetricCard header="Daily Website Views" metric={todaysViews} />
      <MetricCard header="Weekly Website Views" metric={weekViews} />
      <MetricCard header="Total Website Views" metric={totalViews} />
    </>
  );
}
