import React from 'react';
import { Link } from 'react-router-dom';

import { cx } from 'lib/clsx';

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
  const baseClasses = 'rounded px-3 py-1 text-sm font-semibold no-underline';

  if (variant === 'active') {
    return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`;
  }

  return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200`;
};

export function TagLink({ children, href, className, variant = 'default' }: TagLinkProps) {
  return (
    <Link to={href} className={cx(getTagClasses(variant), className)}>
      {children}
    </Link>
  );
}

export function TagButton({ children, onClick, className, variant = 'default' }: TagButtonProps) {
  return (
    <button onClick={onClick} className={cx(getTagClasses(variant), className)}>
      {children}
    </button>
  );
}
