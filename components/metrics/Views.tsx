import MetricCard from 'components/metrics/Card';
import {
  getTotalTodayViews,
  getTotalViews,
  getTotalWeekViews
} from 'services/supabase';

export default async function Views() {
  const todaysViews = await getTotalTodayViews();
  const weekViews = await getTotalWeekViews();
  const totalViews = await getTotalViews();

  return (
    <>
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
    </>
  );
}
