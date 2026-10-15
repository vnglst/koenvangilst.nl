import type { ComponentProps } from 'react';
import { cx } from '#/lib/clsx';

export function Note({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('editorial-note', className)} {...props} />;
}
