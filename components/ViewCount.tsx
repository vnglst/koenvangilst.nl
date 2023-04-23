'use client';

import { useRef } from 'react';
import { useOnScreen } from 'app/hooks/useOnScreen';
import useSWR from 'swr';

import fetcher from 'lib/fetcher';

type ViewCountProps = {
  initialCount?: number;
  path: string;
  className?: string;
};

export function ViewCount({ initialCount, path, className }: ViewCountProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isOnScreen = useOnScreen(ref);

  const { data: views } = useSWR<number>(
    isOnScreen ? `/api/views/path?path=${path}` : null,
    fetcher,
    { fallbackData: initialCount, revalidateOnFocus: true }
  );

  return (
    <span className={className} ref={ref}>
      {`${views ? views.toLocaleString() : '–––'} views`}
    </span>
  );
}
