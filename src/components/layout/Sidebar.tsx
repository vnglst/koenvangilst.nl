import { Link } from '@tanstack/react-router';

import { ThemeToggleText } from '#/components/theme/ThemeToggleText';
import { cx } from '#/lib/clsx';
import { navItems, useIsActive } from '#/lib/navigation';

import avatarUrl from '../../assets/avatar.jpg?url';

export function Sidebar() {
  const isActive = useIsActive();

  return (
    <aside className="hidden w-[200px] flex-shrink-0 md:block">
      <div className="sticky top-20">
        {/* Logo and Name */}
        <div className="mb-8 pl-8">
          <Link to="/">
            <img
              alt="Koen van Gilst"
              height={48}
              width={48}
              src={avatarUrl}
              fetchPriority="high"
              className="rotate-3 rounded-full grayscale-10 filter transition hover:rotate-0 hover:grayscale-0"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-start">
          <nav aria-label="Main navigation">
            <ul className="flex flex-col items-start">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    search={{} as never}
                    params={{} as never}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cx(
                      'flex items-center py-1 pl-3 text-sm font-medium whitespace-nowrap transition-opacity',
                      isActive(item.href)
                        ? 'text-primary dark:text-primary'
                        : 'text-gray-800 hover:opacity-70 dark:text-gray-300'
                    )}
                  >
                    <span className={cx('mr-2 w-2', isActive(item.href) ? 'animate-blink text-primary' : 'invisible')}>
                      &gt;
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 pl-6">
            <ThemeToggleText />
          </div>
        </div>
      </div>
    </aside>
  );
}
