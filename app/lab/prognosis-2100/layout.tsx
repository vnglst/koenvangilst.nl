import { Suspense } from 'react';
import Link from 'next/link';

import { PrognosisToggle } from './(components)/PrognosisToggle';

export default async function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-slate-50 p-4 shadow-sm md:px-8 dark:bg-slate-950">
        {/* Back Button */}
        <Link
          href="/lab"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-opacity hover:opacity-60 dark:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>

        {/* Title */}
        <h1 className="nimbus absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-wide text-gray-900 uppercase md:text-2xl dark:text-gray-100">
          Prognosis 2100
        </h1>

        {/* Toggle */}
        <Suspense fallback={<div className="h-9 w-20" />}>
          <PrognosisToggle />
        </Suspense>
      </div>

      {children}
    </div>
  );
}
