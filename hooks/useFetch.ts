import { useEffect, useState } from 'react';

type UseFetchOptions = {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
};

/**
 * Simple data fetching hook with polling support
 * Lightweight alternative to SWR for simple use cases
 */
export function useFetch<T>(
  url: string,
  fetcher: (url: string) => Promise<T>,
  options: UseFetchOptions = {}
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchData = async () => {
      try {
        const result = await fetcher(url);
        if (mounted) {
          setData(result);
          setError(undefined);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling if refreshInterval is provided
    if (options.refreshInterval) {
      intervalId = setInterval(fetchData, options.refreshInterval);
    }

    // Set up revalidate on focus
    if (options.revalidateOnFocus) {
      const handleFocus = () => fetchData();
      window.addEventListener('focus', handleFocus);

      return () => {
        mounted = false;
        if (intervalId) clearInterval(intervalId);
        window.removeEventListener('focus', handleFocus);
      };
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [url, options.refreshInterval, options.revalidateOnFocus, fetcher]);

  return { data, error, isLoading };
}
