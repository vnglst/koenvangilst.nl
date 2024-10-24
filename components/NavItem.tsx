'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { cx } from 'lib/clsx';

export function NavItem({ slug, text }: { slug: string; text: string }) {
  const pathname = usePathname()!;
  const isActive = pathname.includes(slug);

  return (
    <NextLink
      href={`/${slug}`}
      className={cx(
        isActive ? 'font-semibold text-gray-800 dark:text-gray-200' : 'font-normal text-gray-600 dark:text-gray-400',
        'inline-block rounded-lg p-1 ring-primary transition-all hover:ring-2 sm:px-3 sm:py-2'
      )}
    >
      {text}
    </NextLink>
  );
}

export function NavItemHome() {
  const pathname = usePathname();
  const isActive = pathname === '/';

  return (
    <NextLink
      href="/"
      className={
        'mr-auto rounded-lg p-1 font-normal text-gray-600 ring-primary transition-all hover:ring-2 dark:text-gray-400 sm:px-3 sm:py-2'
      }
    >
      <svg height="20" width="20" role="img" viewBox="0 0 640 512" aria-label="terminal with blinking cursor">
        <path
          className={cx(isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400')}
          fill="currentColor"
          d="m218.2 230.54c-15.65-15.65-140.86-140.86-156.51-156.51-5.12-5.13-11.53-7.83-18.53-7.83-7.02 0-13.43 2.71-18.53 7.83-1.68 1.68-15.12 15.12-16.8 16.8-5.12 5.12-7.82 11.53-7.82 18.5 0 7.02 2.71 13.43 7.83 18.53l121.2 121.2c-72.73 72.73-113.13 113.14-121.21 121.22-5.12 5.12-7.83 11.53-7.83 18.52 0 7 2.71 13.41 7.83 18.51 1.68 1.67 15.07 15.07 16.75 16.74 5.1 5.16 11.53 7.88 18.58 7.88 7.03 0 13.44-2.72 18.52-7.83 15.65-15.65 140.88-140.87 156.53-156.52 5.12-5.13 7.82-11.53 7.82-18.52 0-6.98-2.7-13.38-7.83-18.52z"
        />
        <path
          className={cx(isActive ? 'blink text-primary' : 'text-gray-600 dark:text-gray-400')}
          fill="currentColor"
          d="m275.2 358.4c-7.19 0-13.59 2.58-18.55 7.51-4.88 4.91-7.47 11.31-7.47 18.5v21.5c0 7.24 2.6 13.65 7.48 18.51 4.91 4.92 11.32 7.51 18.54 7.51h322.45c7.22 0 13.63-2.6 18.5-7.48 4.91-4.9 7.52-11.32 7.52-18.55 0-2.15 0-19.35 0-21.5 0-7.19-2.59-13.59-7.53-18.56-4.91-4.86-11.3-7.44-18.49-7.44-64.49 0-290.2 0-322.45 0z"
        />
      </svg>
    </NextLink>
  );
}
