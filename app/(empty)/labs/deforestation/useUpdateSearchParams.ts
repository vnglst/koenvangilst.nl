import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useUpdateSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = React.useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return { searchParams, updateParams };
}
