import { Suspense } from 'react';

import { VisitsVisual } from 'components/VisitsVisual';
import { getViewsPerDay } from 'services/supabase';

export const revalidate = 60 * 60;

export const metadata = {
  title: 'All time visits',
  description: 'Visual showing the all time visits for my website.'
};

export default async function TodaysVisits() {
  return (
    <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden text-black dark:text-white">
      <div className="mb-4 w-full max-w-2xl mx-auto">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4">
          Visitor Stats
        </h1>
      </div>
      <div className="aspect-video min-h-[80vh] md:min-h-0 w-full rounded-xl overflow-hidden bg-[#111827]">
        <Suspense>
          <VisualContainer />
        </Suspense>
      </div>
    </article>
  );
}

async function VisualContainer() {
  const visits = await getViewsPerDay(365);
  return <VisitsVisual visits={visits} />;
}
