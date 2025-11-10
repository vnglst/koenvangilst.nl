'use client';

import { Link, useLocation } from 'react-router-dom';

import { ThemeToggleText } from 'components/theme/ThemeToggleText';
import { cx } from 'lib/clsx';

const navItems = [
  { href: '/', label: 'About' },
  { href: '/lab', label: 'Lab' },
  { href: '/photography', label: 'Photography' }
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="-mx-4 px-4 md:mx-0 md:w-[200px] md:flex-shrink-0 md:px-0">
      <div className="lg:sticky lg:top-20">
        {/* Logo and Name */}
        <div className="mb-8 flex flex-row items-center space-x-4 md:mb-8 md:space-x-0 md:pl-6">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <img
              alt="Koen van Gilst"
              height={48}
              width={48}
              src="/app/avatar.jpg"
              className="rounded-full grayscale filter"
            />
          </Link>
          <div className="nimbus text-lg font-bold tracking-wide uppercase md:hidden">
            <Link to="/">Koen van Gilst</Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-row items-center space-x-2 pb-4 md:flex-col md:items-start md:space-x-0 md:px-0 md:pb-0">
          <nav aria-label="Main navigation">
            <ul className="flex flex-row items-center space-x-2 md:flex-col md:items-start md:space-x-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cx(
                      'py-1 text-sm font-medium whitespace-nowrap transition-opacity md:pl-3',
                      'before:mr-2 before:hidden before:h-1 before:w-1 before:rounded-full before:transition-opacity md:before:inline-block',
                      isActive(item.href)
                        ? 'text-primary dark:text-primary before:bg-primary before:opacity-100'
                        : 'text-gray-800 before:opacity-0 hover:opacity-70 dark:text-gray-300'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto md:mt-6 md:ml-0 md:pl-6">
            <ThemeToggleText />
          </div>
        </div>
      </div>
    </aside>
  );
}
