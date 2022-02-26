import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    // track initial page view
    trackPageView();

    // track page views on route change
    router.events.on('routeChangeComplete', trackPageView);

    return () => {
      // remove listener on unmount
      router.events.off('routeChangeComplete', trackPageView);
    };
  }, [router.events]);
};

function trackPageView() {
  const url = '/api/views';

  // don't track in dev
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  // use sendBeacon if browser supports it
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url);
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.send();
  }
}
