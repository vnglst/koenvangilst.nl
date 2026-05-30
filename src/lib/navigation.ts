import { useRouterState } from '@tanstack/react-router';

export const navItems = [
  { href: '/', label: 'About' },
  { href: '/lab', label: 'Lab' },
  { href: '/photography', label: 'Photography' }
];

export function useIsActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
}
