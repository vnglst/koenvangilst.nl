import React from 'react';
import { cx } from 'lib/clsx';

type IconButtonVariant = 'default' | 'ghost' | 'overlay';
type IconButtonSize = 'sm' | 'md' | 'lg';

type IconButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  'aria-label': string; // Required for accessibility
};

const getVariantClasses = (variant: IconButtonVariant) => {
  const variants = {
    default:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700',
    ghost:
      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700',
    overlay:
      'bg-black/50 text-white backdrop-blur-sm hover:bg-white/90 hover:text-black focus:ring-4 focus:ring-white/50'
  };

  return variants[variant];
};

const getSizeClasses = (size: IconButtonSize) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  return sizes[size];
};

export function IconButton({
  children,
  onClick,
  className,
  variant = 'default',
  size = 'md',
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(baseClasses, getVariantClasses(variant), getSizeClasses(size), className)}
      {...props}
    >
      {children}
    </button>
  );
}
