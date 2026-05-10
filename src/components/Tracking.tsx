import { useEffect } from 'react';

export const Tracking = () => {
  useEffect(() => {
    if (document.querySelector('script[data-domain="koenvangilst.nl"]')) return;
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', 'koenvangilst.nl');
    script.setAttribute('data-api', 'https://plausible.koenvangilst.nl/api/event');
    // script.local.js enables tracking on localhost (dev)
    script.src = import.meta.env.DEV
      ? 'https://plausible.koenvangilst.nl/js/script.local.js'
      : 'https://plausible.koenvangilst.nl/js/script.js';
    document.head.appendChild(script);
  }, []);

  return null;
};
