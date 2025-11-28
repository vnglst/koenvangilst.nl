import { PropsWithChildren, Suspense } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';
import { Sidebar } from './Sidebar';

type ContainerProps = {
  footer?: boolean;
};

export function Container({ children, footer = true }: PropsWithChildren<ContainerProps>) {
  return (
    <>
      {/* Mobile header only */}
      <Header />

      {/* Desktop layout with sidebar */}
      <div className="mx-4 mt-20 mb-40 flex max-w-4xl flex-col md:mt-20 md:flex-row lg:mx-auto lg:mt-32">
        <Sidebar />
        <Main>
          <Suspense>
            <div className="w-full md:w-9/12">{children}</div>
            {footer && <Footer />}
          </Suspense>
        </Main>
      </div>
    </>
  );
}
