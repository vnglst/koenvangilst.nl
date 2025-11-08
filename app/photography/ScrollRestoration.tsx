'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY = 'photography-scroll-position';

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Only restore scroll on the photography page (not on photo detail)
    if (pathname === '/photography') {
      const savedPosition = sessionStorage.getItem(SCROLL_KEY);
      if (savedPosition) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }, 0);
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Save scroll position before navigating away from photography page
    const handleScroll = () => {
      if (pathname === '/photography') {
        sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}
