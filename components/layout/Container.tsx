import { PropsWithChildren, Suspense } from 'react';
import Link from 'next/link';

import { Footer } from './Footer';
import { Main } from './Main';
import { Sidebar } from './Sidebar';

type ContainerProps = {
  footer?: boolean;
  sidebar?: boolean;
  showTitle?: boolean;
};

export function Container({ children, footer = true, sidebar = true, showTitle = true }: PropsWithChildren<ContainerProps>) {
  return (
    <div className="mx-4 mt-8 mb-40 flex max-w-5xl flex-col md:mt-20 md:flex-row lg:mx-auto lg:mt-32">
      {sidebar && <Sidebar />}
      <Main>
        <Suspense>
          {showTitle && (
            <div className="nimbus mt-[9px] mb-4 hidden text-sm font-bold tracking-wide uppercase md:block">
              <Link href="/">Koen van Gilst</Link>
            </div>
          )}
          <div className="w-full md:w-9/12">{children}</div>
          {footer && <Footer />}
        </Suspense>
      </Main>
    </div>
  );
}
