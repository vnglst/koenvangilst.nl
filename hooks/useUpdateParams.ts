import React from 'react';
import { useNavigate, useSearchParams as useRouterSearchParams } from 'react-router-dom';

export function useUpdateParams() {
  const navigate = useNavigate();
  const [searchParams] = useRouterSearchParams();

  const updateParams = React.useCallback(
    (newParams: Record<string, string>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        currentParams.set(key, value);
      });

      navigate(`?${currentParams.toString()}`, { replace: true });
    },
    [navigate, searchParams]
  );

  const deleteParam = React.useCallback(
    (param: string) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete(param);

      navigate(`?${currentParams.toString()}`, { replace: true });
    },
    [navigate, searchParams]
  );

  return { searchParams, deleteParam, updateParams };
}
