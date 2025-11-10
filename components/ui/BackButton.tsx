'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <Button onClick={handleClick} variant={variant} size={size} className={className} aria-label="Go back">
      <Icon icon="arrow-left" className="h-4 w-4" />
      {children}
    </Button>
  );
}
