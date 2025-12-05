'use client';

import { useEffect, useState } from 'react';

import { Icon } from 'components/ui/Icon';

import { Theme, useTheme } from './theme.store';

const PREFERS_DARK = '(prefers-color-scheme: dark)';

export function ThemeToggleText() {
  const theme = useTheme((state) => state.theme);
  const setTheme = useTheme((state) => state.setTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  function handleClick() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? Theme.Dark : Theme.Light;
    setTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="h-4 w-4" aria-hidden="true" />;
  }

  return (
    <button
      onClick={handleClick}
      className="pt-2 pr-2 pb-2 text-gray-700 transition-opacity hover:cursor-pointer hover:opacity-60 dark:text-gray-400"
      aria-label={`Switch to ${theme === Theme.Dark ? 'light' : 'dark'} mode`}
    >
      <Icon icon={theme === Theme.Dark ? 'moon' : 'sun'} className="h-4 w-4" />
    </button>
  );
}
