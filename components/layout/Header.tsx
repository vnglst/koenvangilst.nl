'use client';

import Avatar from 'app/avatar.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeToggleText } from 'components/theme/ThemeToggleText';
import { cx } from 'lib/clsx';

const navItems = [
  { href: '/', label: 'About' },
  { href: '/lab', label: 'Lab' },
  { href: '/photography', label: 'Photography' }
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-5xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image
              alt="Koen van Gilst"
              height={36}
              width={36}
              src={Avatar}
              className="rounded-full grayscale filter"
              priority
            />
            <span className="nimbus hidden text-base font-bold uppercase tracking-wide sm:inline">
              Koen van Gilst
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cx(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary dark:text-primary'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
                  isActive(item.href) && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Theme toggle and mobile menu */}
          <div className="flex items-center gap-4">
            <ThemeToggleText />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 border-t border-gray-200 pt-4 dark:border-gray-800" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cx(
                  'block px-4 py-3 text-base font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary dark:text-primary bg-gray-50 dark:bg-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
