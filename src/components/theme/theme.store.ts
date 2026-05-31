import { create } from 'zustand';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

type Store = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  const isDark = theme === Theme.Dark;
  document.documentElement.classList.toggle('dark', isDark);
  window.localStorage.setItem('theme', theme);
}

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return Theme.Dark;
  const darkClass = document.documentElement.classList.contains('dark');
  return darkClass ? Theme.Dark : Theme.Light;
};

export const useTheme = create<Store>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  }
}));
