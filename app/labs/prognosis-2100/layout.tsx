import Link from 'next/link';

import { Container } from 'components/Container';

import { PrognosisToggle } from './(components)/PrognosisToggle';

export default async function Layout({ children }) {
  return (
    <Container footer={false} nav={true} useLayout={false}>
      <div className="pt-16">
        <nav className="sticky top-0 z-20 flex items-center gap-4 overflow-hidden bg-white p-4 text-slate-700 dark:bg-black dark:text-slate-300 md:px-8">
          <Link
            href="/labs/prognosis-2100"
            className="block whitespace-nowrap rounded-md border-2 border-slate-900 bg-primary-bright px-3 py-1 text-2xl font-black text-slate-900 dark:border-white dark:text-slate-900"
          >
            Prognosis 2100
          </Link>
          <PrognosisToggle />
        </nav>
        {children}
      </div>
    </Container>
  );
}
