import Link from 'next/link';

import Icon from 'components/Icon';

import { PrognosisToggle } from './(components)/PrognosisToggle';

export default async function Layout({ children }) {
  return (
    <div>
      <nav className="mb-8 flex w-full items-center justify-center gap-5 text-slate-700 dark:text-slate-300">
        <Link
          href="/prognose-2100"
          className="bg-primary-bright block whitespace-nowrap rounded-md border-2 border-slate-900 px-3 py-1 text-2xl font-black text-slate-900 dark:border-white dark:text-slate-900"
        >
          Prognosis 2100
        </Link>
        <div className="flex items-center space-x-2">
          <PrognosisToggle />
        </div>
      </nav>
      {children}
      <nav className="mb-8 flex w-full gap-5 text-slate-700 dark:text-slate-300">
        <Link href="/prognose-2100/about">
          <Icon icon="info" className="h-6 w-6" />
        </Link>
      </nav>
    </div>
  );
}
