import { Suspense } from 'react';

import { VisitsVisual } from 'components/VisitsVisual';
import { getViewsPerDay } from 'services/supabase';
import { View } from 'services/types';
import { Heading } from 'ui/Heading';

export const revalidate = 60 * 60;

export const metadata = {
  title: 'All time visits',
  description: 'Visual showing the all time visits for my website.'
};

export default async function TodaysVisits() {
  const visits = getViewsPerDay(365);

  return (
    <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden text-black dark:text-white">
      <div className="mb-4 w-full max-w-2xl mx-auto">
        <Heading level={1}>Visitor Stats</Heading>
      </div>
      <div className="aspect-video min-h-[80vh] md:min-h-0 w-full rounded-xl overflow-hidden bg-[#111827]">
        <Suspense>
          <VisualContainer visits={visits} />
        </Suspense>
      </div>
    </article>
  );
}

async function VisualContainer({ visits }: { visits: Promise<View[]> }) {
  const visitsNr = await visits;
  return <VisitsVisual visits={visitsNr} />;
}
