import { ThemeToggle } from '../theme/ThemeToggle';
import { NavItem, NavItemHome } from './NavItem';

export function Nav() {
  return (
    <nav className="bg-opacity-80 dark:bg-opacity-80 fixed top-0 right-0 left-0 z-10 flex items-center justify-start gap-6 bg-slate-50 p-6 backdrop-blur-sm backdrop-saturate-150 md:px-10 dark:bg-slate-950">
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
