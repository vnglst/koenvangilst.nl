'use client';

import { useEffect } from 'react';
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'koenvangilst.nl',
  apiHost: 'https://plausible.koenvangilst.nl',
  trackLocalhost: true
});

export const Tracking = () => {
  useEffect(() => {
    plausible.enableAutoPageviews();
  }, []);

  return null;
};
