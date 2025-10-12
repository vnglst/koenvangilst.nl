'use client';

import { useRouter } from 'next/navigation';

import { Icon } from './Icon';

type BackButtonProps = {
  fallbackHref: string;
  className?: string;
  children?: React.ReactNode;
};

export function BackButton({ fallbackHref, className, children = 'Back' }: BackButtonProps) {
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
    <button onClick={handleClick} className={className}>
      <Icon icon="arrow-left" className="h-4 w-4" />
      {children}
    </button>
  );
}
