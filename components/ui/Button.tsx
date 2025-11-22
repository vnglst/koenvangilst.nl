import React from 'react';

import { cx } from 'lib/clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  'aria-label'?: string;
};

type ButtonAsButton = BaseButtonProps & {
  as?: 'button';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;

type ButtonAsLink = BaseButtonProps & {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const getVariantClasses = (variant: ButtonVariant) => {
  const variants = {
    primary:
      'bg-blue-400 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
    secondary:
      'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700',
    ghost:
      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
  };

  return variants[variant];
};

const getSizeClasses = (size: ButtonSize) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return sizes[size];
};

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = 'primary',
    size = 'md',
    'aria-label': ariaLabel,
    ...restProps
  } = props;

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus:outline-none no-underline';

  const combinedClasses = cx(baseClasses, getVariantClasses(variant), getSizeClasses(size), className);

  if (props.as === 'a') {
    const { href, target, rel, ...anchorProps } = restProps as ButtonAsLink;
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel} className={combinedClasses} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { onClick, disabled = false, type = 'button', ...buttonProps } = restProps as ButtonAsButton;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(combinedClasses, disabled && 'cursor-not-allowed opacity-50')}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
