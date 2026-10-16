import { Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { cx } from '#/lib/clsx';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

type ContainerProps = {
  footer?: boolean;
  wide?: boolean;
  home?: boolean;
  layout?: 'default' | 'reading' | 'photography' | 'art' | 'map';
};

export function Container({
  children,
  footer = true,
  wide = false,
  home = false,
  layout = 'default'
}: PropsWithChildren<ContainerProps>) {
  return (
    <div
      className={cx(
        'site-shell',
        home && 'site-shell-home',
        wide && 'site-shell-wide',
        layout !== 'default' && `site-shell-${layout}`
      )}
    >
      <Sidebar />
      <main id="content" className="site-main">
        <Suspense>
          <div className="site-content">{children}</div>
          {footer && <Footer />}
        </Suspense>
      </main>
    </div>
  );
}
