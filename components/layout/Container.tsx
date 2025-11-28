import { PropsWithChildren, Suspense } from 'react';

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
      <div className="mx-4 mt-20 mb-40 flex max-w-4xl flex-col md:mt-20 md:flex-row lg:mx-auto lg:px-6 lg:mt-32">
        <Sidebar />
        <Main>
          <Suspense>
            <div className={wide ? 'w-full lg:max-w-[calc(100vw-200px-3rem)] lg:min-w-[600px]' : 'w-full md:w-9/12'}>{children}</div>
            {footer && <Footer />}
          </Suspense>
        </Main>
      </div>
    </>
  );
}
