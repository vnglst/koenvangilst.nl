import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { useEffect } from 'react';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';
import { Tracking } from '#/components/Tracking';
import { NavigationProgress } from '#/components/NavigationProgress';
import { Container } from '#/components/layout/Container';
import { Prose } from '#/components/content/Prose';
import { Heading } from '#/components/content/Heading';
import { Link } from '#/components/ui/Link';
import { NotFoundPage } from '#/components/content/NotFoundPage';
import { createFallbackOgImage } from '#/lib/og-image.mjs';

interface MyRouterContext {
  queryClient: QueryClient;
}

const SITE_URL = 'https://koenvangilst.nl';
const FALLBACK_OG_IMAGE = `${SITE_URL}${createFallbackOgImage().url}`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Koen van Gilst - Principal Engineer' },
      {
        name: 'description',
        content:
          'Innovative engineer from the Netherlands, specialising in AI, developer tooling, and building high-performing engineering teams.'
      },
      { property: 'og:image', content: FALLBACK_OG_IMAGE },
      { property: 'og:image:alt', content: 'Koen van Gilst' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: FALLBACK_OG_IMAGE }
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Preload critical fonts to prevent FOUT (Flash of Unstyled Text)
      ...[
        'ibm-plex-sans-400.woff2',
        'ibm-plex-sans-500.woff2',
        'ibm-plex-sans-600.woff2',
        'ibm-plex-sans-700.woff2',
        'Nimbus-Sans-D-OT-Bold-Extended_32745.woff2'
      ].map((filename) => ({
        rel: 'preload',
        href: `/fonts/${filename}`,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous' as const
      })),
      {
        rel: 'preconnect',
        href: 'https://plausible.koenvangilst.nl',
        crossOrigin: 'anonymous'
      },
      { rel: 'me', href: 'https://hachyderm.io/@vnglst' },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml'
      },
      {
        rel: 'icon',
        href: '/static/favicons/favicon-32x32.png',
        sizes: '32x32'
      },
      {
        rel: 'icon',
        href: '/static/favicons/favicon-16x16.png',
        sizes: '16x16'
      },
      { rel: 'shortcut icon', href: '/static/favicons/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        href: '/static/favicons/apple-touch-icon.png',
        sizes: '180x180'
      },
      { rel: 'manifest', href: '/static/favicons/site.webmanifest' }
    ]
  }),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  shellComponent: RootDocument
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full min-w-[320px] font-sans">
      <head>
        <meta name="theme-color" content="#020617" suppressHydrationWarning />
        <HeadContent />
      </head>
      <body className="antialiased">
        <NavigationProgress />
        {/* Skip to main content for keyboard/screen reader users */}
        <a href="#content" className="skip-link">
          Skip to main content
        </a>
        {/* Inline theme detection to prevent FOUC — defaults to dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let preferredTheme = 'dark';
              try { preferredTheme = localStorage.getItem('theme') || 'dark'; } catch {}
              document.documentElement.classList.toggle('dark', preferredTheme !== 'light');

            `
          }}
        />
        {/* Auto-reload on dynamic import failures (e.g. stale chunk after redeploy) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let _reloading = false;
                function reloadIfChunkError(msg) {
                  if (_reloading) return;
                  if (msg && /Failed to fetch dynamically imported module/i.test(msg)) {
                    _reloading = true;
                    window.location.reload();
                  }
                }
                window.addEventListener('error', (e) => reloadIfChunkError(e.message));
                window.addEventListener('unhandledrejection', (e) => reloadIfChunkError(e.reason?.message));
              })();
            `
          }}
        />
        <div className="flex min-h-screen flex-col">{children}</div>
        <Tracking />
        <Scripts />
      </body>
    </html>
  );
}

function ErrorPage({ error }: { error: unknown }) {
  useEffect(() => {
    // If a lazy route chunk is missing after a deploy, reload to fetch fresh assets
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (/Failed to fetch dynamically imported module/.test(errorMessage)) {
      window.location.reload();
      return;
    }
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Prose>
        <Heading level={1}>Something went wrong!</Heading>
        <p>You've run into an error. Have you tried turning it off and on?</p>
        <Link href="/">Return Home</Link>
      </Prose>
    </Container>
  );
}
