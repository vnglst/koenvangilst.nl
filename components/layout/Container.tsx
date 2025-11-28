import { PropsWithChildren, Suspense } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';

type ContainerProps = {
  footer?: boolean;
};

export function Container({ children, footer = true }: PropsWithChildren<ContainerProps>) {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 md:px-6 md:pt-32">
        <Main>
          <Suspense>
            <div className="w-full">{children}</div>
            {footer && <Footer />}
          </Suspense>
        </Main>
      </div>
    </>
  );
}
