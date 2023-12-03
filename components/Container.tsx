import { PropsWithChildren } from 'react';
import cx from 'clsx';

type ContainerProps = {
  centered?: boolean;
};

export function Container({
  children,
  centered = false
}: PropsWithChildren<ContainerProps>) {
  const classes = cx(
    'flex flex-col items-start justify-center w-full max-w-2xl',
    {
      'm-auto': centered,
      'mx-auto mb-16': !centered
    }
  );

  return <div className={classes}>{children}</div>;
}
