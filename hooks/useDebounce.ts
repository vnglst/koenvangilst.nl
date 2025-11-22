import { useEffect, useMemo, useRef } from 'react';

type Fn = () => void;

// Native debounce implementation to avoid lodash dependency
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: unknown[]) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  }) as T;
}

export const useDebounce = (callback: Fn, time: number) => {
  const ref = useRef<Fn>(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, time);
  }, [time]);

  return debouncedCallback;
};
