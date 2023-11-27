'use client';

import { useEffect } from 'react';

import Icon from 'ui/Icon';

const PREFERS_DARK = '(prefers-color-scheme: dark)';

export default function ThemeToggle() {
  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    window
      .matchMedia(PREFERS_DARK)
      .addEventListener('change', handleThemeChange);

    return () => {
      window
        .matchMedia(PREFERS_DARK)
        .removeEventListener('change', handleThemeChange);
    };
  }, []);

  function handleClick() {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark');
    window.localStorage.setItem('theme', theme ? 'dark' : 'light');
  }

  return (
    <div className="font-semibold text-gray-800 dark:text-gray-200">
      <button
        aria-label={`Toggle between light and dark mode`}
        onClick={handleClick}
        className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-900 dark:ring-gray-100 transition-all"
      >
        {/* 
          We're not using JS here to conditionally display the correct dark mode but CSS (using dark class)
          This way the correct icon is displayed on first render and there is no Flash of Incorrect Icon
        */}
        <Icon icon="sun" className="h-5 w-5 block dark:hidden" />
        <Icon icon="moon" className="h-5 w-5 hidden dark:block" />
      </button>
    </div>
  );
}
