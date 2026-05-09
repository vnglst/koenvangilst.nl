import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export function useUpdateParams() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );

  const updateParams = React.useCallback(
    (newParams: Record<string, string>) => {
      const currentParams = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : ''
      );
      Object.entries(newParams).forEach(([key, value]) => {
        currentParams.set(key, value);
      });
      void navigate({ search: Object.fromEntries(currentParams.entries()) as any, replace: true });
    },
    [navigate]
  );

  const deleteParam = React.useCallback(
    (param: string) => {
      const currentParams = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : ''
      );
      currentParams.delete(param);
      void navigate({ search: Object.fromEntries(currentParams.entries()) as any, replace: true });
    },
    [navigate]
  );

  return { searchParams, deleteParam, updateParams };
}
