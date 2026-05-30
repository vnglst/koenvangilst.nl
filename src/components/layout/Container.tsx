import { Suspense } from 'react';
import type { PropsWithChildren } from 'react';

import { cx } from '#/lib/clsx';
import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';
import { Sidebar } from './Sidebar';

type ContainerProps = {
  footer?: boolean;
  wide?: boolean;
};

export function Container({ children, footer = true, wide = false }: PropsWithChildren<ContainerProps>) {
  return (
    <>
      {/* Mobile header only */}
      <Header />

      {/* Desktop layout with sidebar */}
      <div className="mx-4 mt-20 flex max-w-4xl flex-1 flex-col md:mt-20 md:flex-row lg:mx-auto lg:mt-32 lg:px-6">
        <Sidebar />
        <Main>
          <Suspense>
            <div
              className={cx('w-full flex-1', wide ? 'lg:max-w-[calc(100vw-200px-3rem)] lg:min-w-[600px]' : 'md:w-9/12')}
            >
              {children}
            </div>
            {footer && <Footer />}
          </Suspense>
        </Main>
      </div>
    </>
  );
}
