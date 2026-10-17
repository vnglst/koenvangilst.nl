import type { ComponentProps, ReactNode } from 'react';
import { cx } from '#/lib/clsx';
import { Text } from '#/components/ui/Text';

type ContentImageProps = ComponentProps<'img'> & { label?: ReactNode };

export function ContentImage({ alt = '', label, className, loading = 'lazy', ...props }: ContentImageProps) {
  const image = <img alt={alt} loading={loading} className={cx('content-image', className)} {...props} />;
  return label ? <figure className="content-figure">{image}<Text as="figcaption" size="caption" tone="muted">{label}</Text></figure> : image;
}
