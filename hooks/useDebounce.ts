import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';

type Fn = () => void;

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
