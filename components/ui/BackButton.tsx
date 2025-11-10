'use client';

import { useNavigate } from 'react-router-dom';

import { Icon } from './Icon';

type BackButtonProps = {
  fallbackHref: string;
  className?: string;
  children?: React.ReactNode;
};

export function BackButton({ fallbackHref, className, children = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackHref);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      <Icon icon="arrow-left" className="h-4 w-4" />
      {children}
    </button>
  );
}
