import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useUpdateParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = React.useCallback(
    (newParams: Record<string, string>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        currentParams.set(key, value);
      });

      router.replace(`?${currentParams.toString()}`);
    },
    [router, searchParams]
  );

  return { searchParams, updateParams };
}
