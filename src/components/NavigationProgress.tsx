import { useRouter } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

/**
 * Thin top-of-page progress bar that appears during route transitions.
 * Gives users visual feedback on slow connections so they know navigation
 * is in progress and the page hasn't frozen.
 *
 * Uses router events (onBeforeNavigate / onResolved) and direct DOM manipulation
 * to guarantee immediate visibility — React state updates inside startTransition
 * may be deferred until the transition completes, making the bar invisible.
 */
export function NavigationProgress() {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const show = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bar.style.display = 'block';
      bar.style.transition = 'none';
      bar.style.width = '0%';
      bar.style.opacity = '1';
      rafRef.current = requestAnimationFrame(() => {
        bar.style.transition = 'width 10s cubic-bezier(0.1, 0.05, 0, 1)';
        bar.style.width = '70%';
      });
    };

    const hide = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bar.style.transition = 'width 200ms ease-out';
      bar.style.width = '100%';
      timerRef.current = setTimeout(() => {
        bar.style.transition = 'opacity 200ms ease-out';
        bar.style.opacity = '0';
        timerRef.current = setTimeout(() => {
          bar.style.display = 'none';
          bar.style.width = '0%';
          bar.style.opacity = '1';
          bar.style.transition = 'none';
        }, 200);
      }, 500);
    };

    const unsubscribeStart = router.subscribe('onBeforeNavigate', show);
    const unsubscribeEnd = router.subscribe('onResolved', hide);

    return () => {
      unsubscribeStart();
      unsubscribeEnd();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [router]);

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
      className="bg-primary fixed top-0 left-0 z-[200] h-[3px]"
      style={{ display: 'none', width: '0%' }}
    />
  );
}
