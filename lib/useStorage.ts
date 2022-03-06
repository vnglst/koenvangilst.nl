import { useState } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  return useStorage(key, initialValue, { storage: window.sessionStorage });
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  return useStorage(key, initialValue, { storage: window.sessionStorage });
}

type UseStorage = <T>(
  key: string,
  initialState: T,
  opts?: {
    serialize?: typeof JSON.stringify;
    deserialize?: typeof JSON.parse;
    storage?: Storage;
  }
) => [T, (newState: T) => void];

/**
 * Storage wrapper around Reacts useState hook which persists any state in the
 * browser using either localStorage (default) or sessionStorage.
 *
 * @param key used for storing data
 * @param initialState initial value of state
 * @param opts you can also use sessionStorage here
 *
 * Example usage:
 * ```tsx
 * const [name, setName] = useStorage('app.name', '')
 *
 * // in component use:
 * // setName(value)
 * ```
 *
 * Or with sessionStorage:
 * ```tsx
 * const [name, setName] = useStorage('app.name', 'Koen van Gilst', { storage: window.sessionStorage })
 * ```
 *
 */
const useStorage: UseStorage = (
  key,
  initialState,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storage = localStorage // you can also use sessionStorage
  } = {}
) => {
  const [state, setState] = useState(() => {
    // make sure we're not running this on the server
    if (typeof window === 'undefined') {
      return initialState;
    }

    try {
      const valueInStorage = storage.getItem(key);

      // if value was stored earlier, use that as initial state for useState
      if (valueInStorage) {
        return deserialize(valueInStorage);
      }

      // nothing saved in storage yet, store initialState from options
      storage.setItem(key, serialize(initialState));
    } catch (error) {
      // logs to the console, or use some error reporting tool here
      console.error(error);
    }

    // use initial state from options to initialize
    return initialState;
  });

  // if component updates state, make sure we also try to store it
  // in our storage, and update the state after that
  const storeState = (newState: typeof initialState) => {
    try {
      storage.setItem(key, serialize(newState));
    } catch (error) {
      console.error(error);
    }
    setState(newState);
  };

  return [state, storeState];
};
