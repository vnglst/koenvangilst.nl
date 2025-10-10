import { type JSX, PropsWithChildren } from 'react';

import { cx } from 'lib/clsx';

type ProseProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

export function Prose({ children, as: Cmp = 'article', className }: PropsWithChildren<ProseProps>) {
  return <Cmp className={cx('dark:prose-dark prose w-full max-w-full text-pretty', className)}>{children}</Cmp>;
}
