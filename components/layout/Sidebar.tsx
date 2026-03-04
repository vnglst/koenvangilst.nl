'use client';

import Avatar from 'app/avatar.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggleText } from 'components/theme/ThemeToggleText';
import { cx } from 'lib/clsx';

const navItems = [
  { href: '/', label: 'About' },
  { href: '/lab', label: 'Lab' },
  { href: '/photography', label: 'Photography' }
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden w-[200px] flex-shrink-0 md:block">
      <div className="sticky top-20">
        {/* Logo and Name */}
        <div className="mb-8 pl-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              alt="Koen van Gilst"
              height={48}
              width={48}
              src={Avatar}
              className="rounded-full grayscale filter"
              priority
              sizes="48px"
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
                    href={item.href}
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
