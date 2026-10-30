import { create } from 'zustand';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

type Store = {
  theme: Theme;
  resolvedTheme: Theme.Light | Theme.Dark;
  syncTheme: () => void;
  setTheme: (theme: Theme) => void;
};

function resolveTheme(theme: Theme): Theme.Light | Theme.Dark {
  return theme === Theme.Dark ||
    (theme === Theme.System &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? Theme.Dark
    : Theme.Light;
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveTheme(theme);
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolvedTheme === Theme.Dark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === Theme.Dark ? '#020617' : '#ffffff');
  }
  return resolvedTheme;
}

function getInitialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem('theme');
    if (stored === Theme.Light || stored === Theme.Dark) return stored;
  } catch {
    // Use the system preference when storage is unavailable.
  }
  return Theme.System;
}

const initialTheme = getInitialTheme();

export const useTheme = create<Store>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: resolveTheme(initialTheme),
  syncTheme: () => set({ resolvedTheme: applyTheme(get().theme) }),
  setTheme: (theme) => {
    const resolvedTheme = applyTheme(theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch {
      // Theme switching still works when the browser blocks storage.
    }
    set({ theme, resolvedTheme });
  }
}));
