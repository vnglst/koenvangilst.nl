import type { ComponentProps } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';

import { cx } from '#/lib/clsx';

import { Icon } from './Icon';

type BaseProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'content' | 'plain';
  externalIndicator?: boolean;
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

  return (
    <>
      {children}
      {icon}
    </>
  );
}

export function Link({
  href,
  children,
  className,
  target,
  rel,
  variant = 'content',
  externalIndicator = true,
  ...props
}: LinkProps) {
  const isExternal = href && href.startsWith('http');

  const variantClasses = variant === 'content' ? 'content-link' : 'plain-link';

  const combinedClassName = cx(variantClasses, className);

  if (isExternal) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        className={cx(combinedClassName, 'break-words')}
        {...props}
      >
        {externalIndicator ? <ExternalLinkContent>{children}</ExternalLinkContent> : children}
      </a>
    );
  }

  if (href.startsWith('#') || /^(mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={combinedClassName} target={target} rel={rel} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={href}
      search={{} as never}
      params={{} as never}
      className={combinedClassName}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
