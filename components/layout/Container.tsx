import { PropsWithChildren, Suspense } from 'react';

import { cx } from 'lib/clsx';

import { Footer } from './Footer';
import { Main } from './Main';
import { Nav } from './Nav';

type ContainerProps = {
  centered?: boolean;
  footer?: boolean;
  nav?: boolean;
  useLayout?: boolean;
};

export function Container({
  children,
  centered = false,
  footer = true,
  nav = true,
  useLayout = true
}: PropsWithChildren<ContainerProps>) {
  const classes = cx(
    'flex flex-col justify-center w-full max-w-[65ch] px-8 py-32 md:px-0 h-full min-h-screen',
    centered ? 'm-auto' : 'mx-auto'
  );

  return (
    <>
      {nav && <Nav />}
      <Main>
        <Suspense>{useLayout ? <div className={classes}>{children}</div> : children}</Suspense>
      </Main>
      {footer && <Footer />}
    </>
  );
}
