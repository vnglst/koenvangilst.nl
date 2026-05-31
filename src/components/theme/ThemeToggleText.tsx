import { useEffect, useState } from 'react';

import { Icon } from '#/components/ui/Icon';

import { Theme, useTheme } from './theme.store';

export function ThemeToggleText() {
  const theme = useTheme((state) => state.theme);
  const setTheme = useTheme((state) => state.setTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleClick() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? Theme.Dark : Theme.Light;
    setTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  }

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
