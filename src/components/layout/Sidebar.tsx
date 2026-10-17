import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { navItems, useIsActive } from '#/lib/navigation';
import { ThemeToggleText } from '../theme/ThemeToggleText';

export function Sidebar() {
  const isActive = useIsActive();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [openPath, setOpenPath] = useState<string>();
  const expanded = openPath === pathname;

  return (
    <aside className="site-colophon">
      <Link to="/" className="site-signature" aria-label="Koen van Gilst" onClick={() => setOpenPath(undefined)}>
        <img src="/avatar.jpg" alt="" width={48} height={48} className="signature-portrait" />
      </Link>
      <div className="site-theme">
        <ThemeToggleText />
      </div>
      <button
        type="button"
        className="site-menu"
        aria-label={expanded ? 'Close navigation' : 'Open navigation'}
        aria-expanded={expanded}
        aria-controls="main-navigation"
        onClick={() => setOpenPath(expanded ? undefined : pathname)}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          {expanded ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <nav id="main-navigation" aria-label="Main navigation" className={expanded ? 'is-expanded' : undefined}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            search={{} as never}
            params={{} as never}
            onClick={() => setOpenPath(undefined)}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {isActive(item.href) && (
              <span className="nav-active-marker" aria-hidden="true">
                &gt;
              </span>
            )}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
