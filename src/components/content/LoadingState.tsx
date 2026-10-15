import type { ComponentProps } from 'react';
import { cx } from '#/lib/clsx';

export function LoadingState({ children = 'Loading…', className, ...props }: ComponentProps<'div'>) {
  return <div role="status" className={cx('editorial-loading', className)} {...props}>{children}</div>;
}

export function TextSkeleton() {
  return <div className="text-skeleton" role="status" aria-label="Loading article"><div aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <span key={index} />)}</div></div>;
}
