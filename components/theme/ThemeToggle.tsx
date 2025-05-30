'use client';
import { useEffect } from 'react';

import { Icon } from '../ui/Icon';
import { Theme, useTheme } from './theme.store';

const PREFERS_DARK = '(prefers-color-scheme: dark)';

export function ThemeToggle() {
  const setTheme = useTheme((state) => state.setTheme);

  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        setTheme(Theme.Dark);
      } else {
        document.documentElement.classList.remove('dark');
        setTheme(Theme.Light);
      }
    };

    window.matchMedia(PREFERS_DARK).addEventListener('change', handleThemeChange);

    return () => {
      window.matchMedia(PREFERS_DARK).removeEventListener('change', handleThemeChange);
    };
  }, [setTheme]);

  useEffect(() => {
    const theme = getInitialTheme();
    setTheme(theme);
  }, [setTheme]);

  function handleClick() {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark');
    const nextTheme = theme ? Theme.Dark : Theme.Light;
    setTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  }

  return (
    <div className="font-semibold text-gray-800 dark:text-gray-200">
      <button
        aria-label={`Toggle between light and dark mode`}
        onClick={handleClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 ring-gray-900 transition-all hover:ring-2 dark:bg-gray-600 dark:ring-gray-100"
      >
        {/* 
          We're not using JS here to conditionally display the correct dark mode but CSS (using dark class)
          This way the correct icon is displayed on first render and there is no Flash of Incorrect Icon
        */}
        <Icon icon="sun" className="block h-5 w-5 dark:hidden" />
        <Icon icon="moon" className="hidden h-5 w-5 dark:block" />
      </button>
    </div>
  );
}

function getInitialTheme(): Theme {
  const darkClass = document.documentElement.classList.contains('dark');
  return darkClass ? Theme.Dark : Theme.Light;
}
