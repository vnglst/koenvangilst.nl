import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '#/lib/clsx';

type TextProps<T extends ElementType> = {
  as?: T;
  size?: 'body' | 'small' | 'caption';
  tone?: 'ink' | 'muted';
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'size' | 'tone'>;

export function Text<T extends ElementType = 'p'>({
  as,
  size = 'body',
  tone = 'ink',
  className,
  ...props
}: TextProps<T>) {
  const Component = as || 'p';
  return (
    <Component
      className={cx('editorial-text', `editorial-text-${size}`, `editorial-text-${tone}`, className)}
      {...props}
    />
  );
}
