import ExternalLink from 'components/ExternalLink';
import VisitsVisual from 'components/VisitsVisual';
import { getViewsPerDay } from 'services/supabase';

export const revalidate = 60 * 1;

export const metadata = {
  title: 'All time visits',
  description: 'Visual showing the all time visits for my website.'
};

export default async function TodaysVisits() {
  const visits = await getViewsPerDay(30);

  return (
    <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden">
      <div className="mb-4 w-full max-w-2xl mx-auto">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Last 30 Days Visits Graph
        </h1>
      </div>
      <div className="w-full max-w-full h-[50vh]">
        <VisitsVisual visits={visits} />
      </div>
      <p className="w-full max-w-2xl mx-auto my-10 tracking-tight text-gray-700 dark:text-gray-400">
        This is a visual showing all page views for the last 30 days. It was
        created using the AirBnB visualizations library{' '}
        <ExternalLink href="https://airbnb.io/visx/areas">
          <b>VisX</b>
        </ExternalLink>
        .
      </p>
    </article>
  );
}
