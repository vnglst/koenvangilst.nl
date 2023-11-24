import { Suspense } from 'react';
import Link from 'next/link';

import { getAllTimeList } from 'services/supabase';

export const revalidate = 60 * 60;

export const metadata = {
  title: 'All links visits',
  description: 'List of a links with visit stats.'
};

export default async function AllLinks() {
  return (
    <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden text-black dark:text-white">
      <div className="container mx-auto py-8 my-5">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-7">
          All links visits
        </h1>
        <ul className="my-2 min-h-[3000px]">
          <Suspense>
            <LinksContainer />
          </Suspense>
        </ul>
      </div>
    </article>
  );
}

async function LinksContainer() {
  const allTime = await getAllTimeList();

  return allTime.map((item, index) => (
    <li key={index} className="w-full flex py-1">
      <Link href={item.url} className="w-full py-2">
        <div className="flex flex-col justify-between md:flex-row">
          <h3 className="w-full mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
            {item.url}
          </h3>
          <span className="w-64 mb-2 text-left text-gray-500 md:text-right md:mb-0">
            {item.views.toLocaleString()}
          </span>
        </div>
      </Link>
    </li>
  ));
}
