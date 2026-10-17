import type { PropsWithChildren } from 'react';
import { cx } from '#/lib/clsx';

export function ChartSection({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cx('chart-scroller', className)}>{children}</div>;
}
