'use client';

import { useEffect } from 'react';

export const Tracking = () => {
  useEffect(() => {
    const configureTracking = async () => {
      const { init } = await import('@plausible-analytics/tracker');

      init({
        domain: 'koenvangilst.nl',
        endpoint: 'https://plausible.koenvangilst.nl/api/event',
        captureOnLocalhost: true
      });
    };

    configureTracking().catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to initialise Plausible tracking', error);
      }
    });
  }, []);

  return null;
};
