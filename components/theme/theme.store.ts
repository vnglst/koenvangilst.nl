import { create } from 'zustand';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

type Store = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Get initial theme from DOM on client side
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return Theme.Light;
  const darkClass = document.documentElement.classList.contains('dark');
  return darkClass ? Theme.Dark : Theme.Light;
};

export const useTheme = create<Store>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    set({ theme });
  }
}));
