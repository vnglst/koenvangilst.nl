import { Link } from '@tanstack/react-router';
import { navItems, useIsActive } from '#/lib/navigation';

export function Sidebar() {
  const isActive = useIsActive();
  return (
    <aside className="site-colophon">
      <Link to="/" className="site-signature">
        Koen van Gilst
      </Link>
      <nav aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            search={{} as never}
            params={{} as never}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
