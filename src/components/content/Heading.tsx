import React from 'react';
import type { PropsWithChildren } from 'react';
import { cx } from '#/lib/clsx';

type Props = { className?: string; centered?: boolean; level?: 1 | 2 | 3 | 4 | 5 | 6; id?: string; size?: 1 | 2 | 3 | 4 | 5 | 6 };
export function Heading({ children, className, centered = false, level = 1, size = level, ...props }: PropsWithChildren<Props>) {
  return React.createElement(
    `h${level}`,
    {
      className: cx('editorial-heading', `editorial-heading-${size}`, centered && 'text-center', className),
      ...props
    },
    children
  );
}
