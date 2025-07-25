import { ThemeToggle } from '../theme/ThemeToggle';
import { NavItem, NavItemHome } from './NavItem';

export function Nav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-10 flex items-center justify-start gap-4 bg-white bg-opacity-80 p-4 backdrop-saturate-50 dark:bg-black dark:bg-opacity-80 md:px-8">
      <a
        href="#content"
        className="absolute -top-12 transform bg-gray-800 px-4 py-3 transition-transform duration-200 focus:translate-y-32 dark:text-white"
      >
        Skip to content
      </a>
      <NavItemHome />
      <NavItem slug="about" text="About" />
      <NavItem slug="lab" text="Lab" />
      <NavItem slug="photography" text="Photography" />
      <ThemeToggle />
    </nav>
  );
}
