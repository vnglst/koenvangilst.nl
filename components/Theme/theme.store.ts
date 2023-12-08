import { create } from 'zustand';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

type Store = {
  theme?: Theme;
  setTheme: (theme: Theme) => void;
};

export const useTheme = create<Store>((set) => ({
  setTheme: (theme: Theme) => {
    set({ theme: theme });
  }
}));
