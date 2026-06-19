import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import { ThemeToggleText } from '#/components/theme/ThemeToggleText';
import { Icon } from '#/components/ui/Icon';
import { cx } from '#/lib/clsx';
import { navItems, useIsActive } from '#/lib/navigation';

export function Header() {
  const isActive = useIsActive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md md:hidden dark:border-gray-800 dark:bg-slate-950/80">
      <div className="mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center gap-3">
            <img
              alt="Koen van Gilst"
              height={36}
              width={36}
              src="/avatar.jpg"
              fetchPriority="high"
              className="rotate-3 rounded-full grayscale-10 filter transition hover:rotate-0 hover:grayscale-0"
            />
          </Link>

          {/* Right side: Theme toggle and mobile menu */}
          <div className="flex items-center gap-4">
            <ThemeToggleText />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon icon={mobileMenuOpen ? 'close' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                search={{} as never}
                params={{} as never}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cx(
                  'flex items-center px-4 py-3 text-base font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary dark:text-primary bg-gray-50 dark:bg-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
                )}
              >
                <span className={cx('mr-2 w-2', isActive(item.href) ? 'animate-blink text-primary' : 'invisible')}>
                  &gt;
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
