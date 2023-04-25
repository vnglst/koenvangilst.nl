'use client';

import { useOnScreen } from 'hooks/useOnScreen';
import useSWR from 'swr';

import fetcher from 'lib/fetcher';

type ViewCountProps = {
  initialCount?: number;
  path: string;
  className?: string;
};

export function ViewCount({ initialCount, path, className }: ViewCountProps) {
  const [setRef, isOnScreen] = useOnScreen<HTMLSpanElement>({
    triggerOnce: true
  });

  const { data: views } = useSWR<number>(
    isOnScreen ? `/api/views/path?path=${path}` : null,
    fetcher,
    { fallbackData: initialCount, revalidateOnFocus: true }
  );

  return (
    <span className={className} ref={setRef}>
      <span className="fade-in" key={`${views}`}>{`${
        views ? views.toLocaleString() : '–––'
      } `}</span>
      views
    </span>
  );
}