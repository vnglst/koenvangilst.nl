'use client';

import cn from 'clsx';
import { useTheme } from 'next-themes';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Nav() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-10 flex gap-4 items-center justify-start p-4 md:px-8 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 backdrop-saturate-50">
      <a
        href="#content"
        className="absolute px-4 py-3 bg-gray-800 dark:text-white transition-transform duration-200 transform -top-12 focus:translate-y-32"
      >
        Skip to content
      </a>
      <NavItemHome />
      <div className="ml-auto" />
      <NavItem href="/portfolio" text="Portfolio" />
      <NavItem href="/labs" text="Labs" />
      <NavItem href="/blog" text="Blog" />
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-900 dark:ring-gray-100 transition-all"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
        {mounted && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5 text-gray-800 dark:text-gray-200"
          >
            {resolvedTheme === 'dark' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            )}
          </svg>
        )}
      </button>
    </nav>
  );
}

function NavItem({ href, text }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NextLink
      href={href}
      className={cn(
        isActive
          ? 'font-semibold text-gray-800 dark:text-gray-200'
          : 'font-normal text-gray-600 dark:text-gray-400',
        'inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:ring-2 ring-primary transition-all'
      )}
    >
      <span className="capsize">{text}</span>
    </NextLink>
  );
}

function NavItemHome() {
  const pathname = usePathname();
  const isActive = pathname === '/';

  return (
    <NextLink
      href="/"
      className={
        'font-normal text-gray-600 dark:text-gray-400 p-1 sm:px-3 sm:py-2 rounded-lg hover:ring-2 ring-primary transition-all'
      }
    >
      <svg
        height="20"
        width="20"
        role="img"
        viewBox="0 0 640 512"
        aria-label="terminal with blinking cursor"
      >
        <path
          className={cn(
            isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
          )}
          fill="currentColor"
          d="m218.2 230.54c-15.65-15.65-140.86-140.86-156.51-156.51-5.12-5.13-11.53-7.83-18.53-7.83-7.02 0-13.43 2.71-18.53 7.83-1.68 1.68-15.12 15.12-16.8 16.8-5.12 5.12-7.82 11.53-7.82 18.5 0 7.02 2.71 13.43 7.83 18.53l121.2 121.2c-72.73 72.73-113.13 113.14-121.21 121.22-5.12 5.12-7.83 11.53-7.83 18.52 0 7 2.71 13.41 7.83 18.51 1.68 1.67 15.07 15.07 16.75 16.74 5.1 5.16 11.53 7.88 18.58 7.88 7.03 0 13.44-2.72 18.52-7.83 15.65-15.65 140.88-140.87 156.53-156.52 5.12-5.13 7.82-11.53 7.82-18.52 0-6.98-2.7-13.38-7.83-18.52z"
        />
        <path
          className={cn(
            isActive ? 'blink text-primary' : 'text-gray-600 dark:text-gray-400'
          )}
          fill="currentColor"
          d="m275.2 358.4c-7.19 0-13.59 2.58-18.55 7.51-4.88 4.91-7.47 11.31-7.47 18.5v21.5c0 7.24 2.6 13.65 7.48 18.51 4.91 4.92 11.32 7.51 18.54 7.51h322.45c7.22 0 13.63-2.6 18.5-7.48 4.91-4.9 7.52-11.32 7.52-18.55 0-2.15 0-19.35 0-21.5 0-7.19-2.59-13.59-7.53-18.56-4.91-4.86-11.3-7.44-18.49-7.44-64.49 0-290.2 0-322.45 0z"
        />
      </svg>
    </NextLink>
  );
}
