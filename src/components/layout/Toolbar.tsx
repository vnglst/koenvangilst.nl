import type { ComponentProps } from 'react';
import { cx } from '#/lib/clsx';

export function Toolbar({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('editorial-toolbar', className)} {...props} />;
}
