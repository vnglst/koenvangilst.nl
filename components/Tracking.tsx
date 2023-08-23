'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const Tracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({
        origin: window.location.origin,
        pathname
      })
    });
  }, [pathname]);

  return null;
};
