import { PropsWithChildren, Suspense } from 'react';

import { Footer } from 'components/Footer';
import { Main } from 'components/Main';
import { Nav } from 'components/Nav';
import { cx } from 'lib/clsx';

type ContainerProps = {
  centered?: boolean;
  footer?: boolean;
  nav?: boolean;
};

export function Container({
  children,
  centered = false,
  footer = true,
  nav = true
}: PropsWithChildren<ContainerProps>) {
  const classes = cx(
    'flex flex-col justify-center w-full max-w-[65ch] px-8 md:px-0 py-32 h-full min-h-screen',
    centered ? 'm-auto' : 'mx-auto'
  );

  return (
    <>
      {nav && <Nav />}
      <Main>
        <Suspense>
          <div className={classes}>{children}</div>;
        </Suspense>
      </Main>
      {footer && <Footer />}
    </>
  );
}
