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
    'flex flex-col items-start justify-center w-full max-w-[65ch]',
    centered ? 'm-auto' : 'mx-auto mb-16'
  );

  return <div className={classes}>{children}</div>;
}
