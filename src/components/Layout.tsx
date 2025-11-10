import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from 'components/layout/Footer';
import { Main } from 'components/layout/Main';
import { Sidebar } from 'components/layout/Sidebar';
import { Tracking } from 'components/Tracking';

export function Layout() {
  // Theme script - runs once on mount
  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const preferredTheme = localStorage.getItem('theme');

    if (preferredTheme) {
      if (preferredTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (systemDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="bg-slate-50 text-gray-800 antialiased dark:bg-slate-950 dark:text-gray-100">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-8 py-24 md:flex-row md:px-16 md:py-32">
        <Sidebar />
        <Main>
          <Outlet />
          <Footer />
        </Main>
      </div>
      <Tracking />
    </div>
  );
}
