import Link from 'next/link';

import { Heading } from 'components/content/Heading';
import { Icon } from 'components/ui/Icon';

export default async function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 z-40 flex w-full items-center justify-between bg-slate-50 p-4 shadow-sm md:px-8 dark:bg-slate-950">
        {/* Back Button */}
        <Link
          href="/lab"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-opacity hover:opacity-60 dark:text-gray-300"
        >
          <Icon icon="arrow-left" className="h-4 w-4" />
          Back
        </Link>

        {/* Title */}
        <Heading
          level={1}
          className="nimbus absolute left-1/2 -translate-x-1/2 text-lg tracking-wide text-gray-900 uppercase md:text-2xl dark:text-gray-100"
        >
          Forest Track
        </Heading>

        {/* Empty div for flex spacing */}
        <div className="w-16" />
      </div>

      {children}
    </div>
  );
}
