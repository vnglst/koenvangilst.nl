import { PropsWithChildren } from 'react';

import { cx } from 'lib/clsx';

type ContainerProps = {
  centered?: boolean;
};

export function Container({
  children,
  centered = false
}: PropsWithChildren<ContainerProps>) {
  const classes = cx(
    'flex flex-col items-start justify-center w-full max-w-[65ch] px-8 md:px-0 py-32',
    centered ? 'm-auto' : 'mx-auto'
  );

  return <div className={classes}>{children}</div>;
}
