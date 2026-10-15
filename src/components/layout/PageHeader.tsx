import type { ReactNode } from 'react';
import { Heading } from '#/components/content/Heading';
import { cx } from '#/lib/clsx';

type PageHeaderProps = { title: string; children?: ReactNode; className?: string };
export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <header className={cx('page-header', className)}>
      <Heading>{title}</Heading>
      {children}
    </header>
  );
}
