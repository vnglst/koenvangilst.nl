import React from 'react';
import { Link as RouterLink } from '@tanstack/react-router';

import { Button } from './Button';
import { cx } from '#/lib/clsx';

type TagVariant = 'default' | 'active';

type TagLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: TagVariant;
};

type TagButtonProps = {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  variant?: TagVariant;
};

const getTagClasses = (variant: TagVariant = 'default') => {
  return variant === 'active' ? 'text-tag text-tag-active' : 'text-tag';
};

export function TagLink({ children, href, className, variant = 'default' }: TagLinkProps) {
  return (
    <RouterLink to={href} search={{} as never} params={{} as never} className={cx(getTagClasses(variant), className)}>
      {children}
    </RouterLink>
  );
}

export function TagButton({ children, onClick, className, variant = 'default' }: TagButtonProps) {
  return (
    <Button
      variant="bare"
      aria-pressed={variant === 'active'}
      onClick={onClick}
      className={cx(getTagClasses(variant), className)}
    >
      {children}
    </Button>
  );
}
