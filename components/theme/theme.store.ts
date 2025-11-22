'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get initial theme from DOM on client side
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return Theme.Light;
  const darkClass = document.documentElement.classList.contains('dark');
  return darkClass ? Theme.Dark : Theme.Light;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme<T>(selector?: (state: ThemeContextType) => T): T {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  if (selector) {
    return selector(context);
  }
  return context as T;
}
