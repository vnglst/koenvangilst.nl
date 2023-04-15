import { cookies } from 'next/headers';
import ThemeToggle from './ThemeToggle';
import { NavItemHome, NavItem } from './NavItem';

export default function Nav() {
  const cookieStore = cookies();
  const userSelected = cookieStore.get('mode')?.value as
    | 'dark'
    | 'light'
    | undefined;

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
      <ThemeToggle userSelected={userSelected} />
    </nav>
  );
}
