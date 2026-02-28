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

function ExternalLinkContent({ children }: { children: React.ReactNode }) {
  const icon = <Icon icon="external-link" className="ml-1 inline h-4 w-4 align-text-bottom" />;

  if (typeof children === 'string') {
    const lastSpace = children.lastIndexOf(' ');
    if (lastSpace !== -1) {
      return (
        <>
          {children.slice(0, lastSpace + 1)}
          <span className="whitespace-nowrap">
            {children.slice(lastSpace + 1)}
            {icon}
          </span>
        </>
      );
    }
  }

  return <>{children}{icon}</>;
}

export function Link({ href, children, className, ...props }: LinkProps) {
  const isExternal = href && href.startsWith('http');

  const variantClasses =
    'underline font-bold text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400';

  const combinedClassName = cx(variantClasses, className);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cx(combinedClassName, 'break-all')} {...props}>
        <ExternalLinkContent>{children}</ExternalLinkContent>
      </a>
    );
  }

  return (
    <NextLink href={href} className={combinedClassName} {...props}>
      {children}
    </NextLink>
  );
}
