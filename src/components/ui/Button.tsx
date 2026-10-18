import React from 'react';

import { cx } from '#/lib/clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'bare';
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
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps | 'as'>;

type ButtonAsLink = BaseButtonProps & {
  as: 'a';
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps | 'as'>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses = {
  primary: 'editorial-button-primary',
  secondary: 'editorial-button-secondary',
  ghost: 'editorial-button-ghost',
  outline: 'editorial-button-outline',
  bare: ''
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export function Button(props: ButtonProps) {
  const { children, className, variant = 'primary', size = 'md', 'aria-label': ariaLabel } = props;

  const baseClasses =
    variant === 'bare'
      ? 'action-button'
      : 'action-button editorial-button inline-flex items-center justify-center gap-2 no-underline';

  const combinedClasses = cx(baseClasses, variantClasses[variant], variant !== 'bare' && sizeClasses[size], className);

  if (props.as === 'a') {
    const { as: _as, children: _ch, className: _cl, variant: _v, size: _s, 'aria-label': _al, ...anchorProps } = props;
    return (
      <a aria-label={ariaLabel} className={combinedClasses} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    as: _as,
    children: _ch,
    className: _cl,
    variant: _v,
    size: _s,
    'aria-label': _al,
    onClick,
    disabled = false,
    type = 'button',
    ...nativeButtonProps
  } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(combinedClasses, disabled && 'cursor-not-allowed opacity-50')}
      {...nativeButtonProps}
    >
      {children}
    </button>
  );
}
