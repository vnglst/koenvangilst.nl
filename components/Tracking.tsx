'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'koenvangilst.nl',
  apiHost: 'https://plausible.vangilst.eu',
  trackLocalhost: true
});

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

  useEffect(() => {
    plausible.enableAutoPageviews();
  }, []);

  return null;
};
