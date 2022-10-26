// import fetcher from 'lib/fetcher';
// import { useViews } from 'lib/useViews';
// import Link from 'next/link';

import type { NextApiRequest, NextApiResponse } from 'next';
import invariant from 'tiny-invariant';

async function getData(slug: string) {
  const pathname = encodeURIComponent(slug);
  const request = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/totals?pathname=eq.${pathname}`,
    {
      headers: { apikey: process.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      method: 'GET'
    }
  );

  invariant(request.status === 200, 'Error retrieving view');

  const json = await request.json();
  const views = json.length > 0 ? json[0].total : 0;
  return { views };
}

export default async function BlogPostCard({ title, slug }) {
  const { views } = await getData('/blog/' + slug);

  return (
    <a
      href={`/blog/${slug}`}
      className="rounded-xl w-full md:w-1/3 p-6 bg-gray-50 dark:bg-black border-dashed border-gray-400 border flex flex-col justify-between up-hover"
    >
      <h4 className="text-lg md:text-lg font-medium mb-6 sm:mb-10 w-full text-gray-900 dark:text-gray-100 tracking-tight">
        {title}
      </h4>
      <div className="flex items-center text-gray-800 dark:text-gray-200 capsize">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="ml-2 align-baseline capsize">
          {views ? new Number(views).toLocaleString() : '–––'}
        </span>
      </div>
    </a>
  );
}
