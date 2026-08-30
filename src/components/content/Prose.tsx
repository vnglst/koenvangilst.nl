import type { PropsWithChildren } from 'react';

import { cx } from '#/lib/clsx';

type ProseProps = {
  as?: 'article' | 'section';
  className?: string;
};

export function Prose({ children, as: Cmp = 'article', className }: PropsWithChildren<ProseProps>) {
  return (
    <Cmp className={cx('dark:prose-dark prose prose-lg md:prose-base w-full max-w-full text-pretty', className)}>
      {children}
    </Cmp>
  );
}
