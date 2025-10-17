import NextLink from 'next/link';

import { Icon } from 'components/ui/Icon';

export default async function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 z-40 flex w-full items-center justify-between bg-slate-50 p-4 shadow-sm md:px-8 dark:bg-slate-950">
        <NextLink
          href="/lab"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-opacity hover:opacity-60 dark:text-gray-300"
        >
          <Icon icon="arrow-left" className="h-4 w-4" />
          Back
        </NextLink>

        <h1 className="nimbus m-0 p-0 text-lg tracking-wide text-gray-900 uppercase md:text-2xl dark:text-gray-100">
          Forest Track
        </h1>

        <div className="w-16" />
      </div>

      {children}
    </div>
  );
}
