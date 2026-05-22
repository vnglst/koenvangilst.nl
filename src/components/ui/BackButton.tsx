import React from 'react';
import { useNavigate } from '@tanstack/react-router';

import { Button } from './Button';
import { Icon } from './Icon';

type BackButtonProps = {
  fallbackHref: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
};

export function BackButton({
  fallbackHref,
  className,
  variant = 'ghost',
  size = 'md',
  children = 'Back'
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (window.history.length > 1) {
      window.history.back();
    } else {
      void navigate({ to: fallbackHref });
    }
  };

  return (
    <Button onClick={handleClick} variant={variant} size={size} className={className} aria-label="Go back">
      <Icon icon="arrow-left" className="h-4 w-4" />
      {children}
    </Button>
  );
}
