import { useEffect, useState } from 'react';

export function useOnScreen<T extends Element>({ rootMargin = '0px', triggerOnce = false } = {}) {
  const [ref, setRef] = useState<T | null>(null);
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && triggerOnce) observer.unobserve(ref);
      },
      { rootMargin }
    );

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [ref, rootMargin, triggerOnce]);
  return [setRef, isIntersecting] as const;
}
