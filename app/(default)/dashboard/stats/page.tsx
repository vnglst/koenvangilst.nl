import { Suspense } from 'react';
import Link from 'next/link';

import { Container } from 'components/ContentContainer';
import { Heading } from 'components/Heading';
import { getAllTimeList } from 'services/supabase';

export const revalidate = 60;

export const metadata = {
  title: 'All links visits',
  description: 'List of a links with visit stats.'
};

export default async function AllLinks() {
  return (
    <Container>
      <Heading level={1}>All links visits</Heading>
      All links visits
      <ul className="my-2 min-h-[3000px]">
        <Suspense>
          <LinksContainer />
        </Suspense>
      </ul>
    </Container>
  );
}

async function LinksContainer() {
  const list = await getAllTimeList();

  return list.map((item, index) => (
    <li key={index} className="flex w-full py-1">
      <Link href={item.url} className="w-full py-2" prefetch={false}>
        <div className="flex flex-col justify-between md:flex-row">
          <h3 className="mb-2 w-full text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
            {item.url}
          </h3>
          <span className="mb-2 w-64 text-left text-gray-500 md:mb-0 md:text-right">
            {item.views.toLocaleString()}
          </span>
        </div>
      </Link>
    </li>
  ));
}
