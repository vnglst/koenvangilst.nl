import { ComponentProps } from 'react';
import NextLink from 'next/link';

import { cx } from 'lib/clsx';

import { Icon } from './Icon';

type BaseProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

type LinkProps = BaseProps & Omit<ComponentProps<'a'>, keyof BaseProps>;

export function Link({ href, children, className, ...props }: LinkProps) {
  const isExternal = href && href.startsWith('http');

  const variantClasses =
    'underline font-bold text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400';

  const combinedClassName = cx(variantClasses, className);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClassName} {...props}>
        <span className="inline-flex items-center">
          {children}
          <Icon icon="external-link" className="ml-1 h-4 w-4" />
        </span>
      </a>
    );
  }

  return (
    <NextLink href={href} className={combinedClassName} {...props}>
      {children}
    </NextLink>
  );
}
