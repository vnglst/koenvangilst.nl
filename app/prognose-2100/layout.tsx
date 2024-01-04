import Link from 'next/link';

import Icon from 'components/Icon';

export default async function Layout({ children }) {
  return (
    <div>
      <nav className="mb-8 flex w-full items-center justify-center gap-5 text-slate-700 dark:text-slate-300">
        <Link
          href="/prognose-2100"
          className="block whitespace-nowrap rounded-md border-2 border-slate-900 bg-[#74e2ff] px-3 py-1 text-2xl font-black text-slate-900 dark:border-white dark:text-slate-900"
        >
          Prognose 2100
        </Link>
        <Link href="/prognose-2100/about">
          <Icon icon="info" className="h-6 w-6" />
        </Link>
      </nav>
      {children}
    </div>
  );
}