import Link from 'next/link';

import { Body } from 'components/Body';
import { Footer } from 'components/Footer';
import { Icon } from 'components/Icon';
import { Main } from 'components/Main';

import { PrognosisToggle } from './(components)/PrognosisToggle';

export default async function Layout({ children }) {
  return (
    <Body>
      <nav className="sticky top-0 z-20 flex items-center justify-center gap-4 overflow-hidden bg-white p-4 text-slate-700 md:px-8 dark:bg-black dark:text-slate-300">
        <Link
          href="/labs/prognosis-2100"
          className="block whitespace-nowrap rounded-md border-2 border-slate-900 bg-primary-bright px-3 py-1 text-2xl font-black text-slate-900 dark:border-white dark:text-slate-900"
        >
          Prognosis 2100
        </Link>
        <PrognosisToggle />
        <Link href="/labs/prognosis-2100/about" className="ml-auto mr-1">
          <Icon icon="info" className="h-6 w-6" />
        </Link>
      </nav>
      <Main>{children}</Main>
      <Footer />
    </Body>
  );
}
