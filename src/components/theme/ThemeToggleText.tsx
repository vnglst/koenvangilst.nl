import { useEffect, useState } from 'react';

import { Button } from '#/components/ui/Button';
import { Theme, useTheme } from './theme.store';

export function ThemeToggleText() {
  const theme = useTheme((state) => state.theme);
  const resolvedTheme = useTheme((state) => state.resolvedTheme);
  const setTheme = useTheme((state) => state.setTheme);
  const syncTheme = useTheme((state) => state.syncTheme);
  const nextTheme = resolvedTheme === Theme.Light ? Theme.Dark : Theme.Light;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    syncTheme();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', syncTheme);
    return () => media.removeEventListener('change', syncTheme);
  }, [syncTheme]);

  function handleClick() {
    setTheme(nextTheme);
  }

  if (!mounted) {
    return <div className="h-11 w-11" aria-hidden="true" />;
  }

  return (
    <Button
      variant="bare"
      onClick={handleClick}
      className="theme-toggle"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Theme: ${theme}. Switch to ${nextTheme} mode`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        {nextTheme === Theme.Dark ? (
          <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5 8.7 8.7 0 1 0 20.5 14.3Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        )}
      </svg>
    </Button>
  );
}
