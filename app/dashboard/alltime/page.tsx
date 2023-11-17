import Link from 'next/link';

import { VisitsVisual } from 'components/VisitsVisual';
import { getAllTimeList, getViewsPerDay } from 'services/supabase';

export const revalidate = 60 * 60;

export const metadata = {
  title: 'All time visits',
  description: 'Visual showing the all time visits for my website.'
};

export default async function TodaysVisits() {
  const visits = await getViewsPerDay(365);
  const allTime = await getAllTimeList();

  return (
    <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden text-black dark:text-white">
      <div className="mb-4 w-full max-w-2xl mx-auto">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4">
          Visitor Stats
        </h1>
      </div>
      <VisitsVisual visits={visits} />
      <div className="container mx-auto py-8 my-5">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 my-5">
          All links with views
        </h2>
        <ul className="my-2">
          {allTime.map((item, index) => (
            <li key={index} className="w-full flex py-3">
              <Link href={`/blog/${item.url}`} className="w-full">
                <div className="flex flex-col justify-between md:flex-row up-hover">
                  <h3 className="w-full mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
                    {item.url}
                  </h3>
                  <span className="w-64 mb-2 text-left text-gray-500 md:text-right md:mb-0">
                    {item.views.toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
