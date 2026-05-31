import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { Suspense, lazy, useEffect } from 'react';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';
import { Tracking } from '#/components/Tracking';
import { NavigationProgress } from '#/components/NavigationProgress';
import { Container } from '#/components/layout/Container';
import { Prose } from '#/components/content/Prose';
import { Heading } from '#/components/content/Heading';
import { Link } from '#/components/ui/Link';
import { NotFoundPage } from '#/components/content/NotFoundPage';

// DevTools are only bundled in development — tree-shaken away in production
const DevTools = import.meta.env.DEV
  ? lazy(() => import('#/components/DevTools').then((m) => ({ default: m.DevTools })))
  : null;

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#199acc' },
      { title: 'Koen van Gilst - Tech Lead' },
      {
        name: 'description',
        content:
          'Innovative tech lead from the Netherlands, specialising in AI, developer tooling, and building high-performing engineering teams.'
      }
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Preload critical fonts to prevent FOUT (Flash of Unstyled Text)
      {
        rel: 'preload',
        href: '/fonts/ibm-plex-sans-400.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'preload',
        href: '/fonts/ibm-plex-sans-500.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'preload',
        href: '/fonts/ibm-plex-sans-600.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'preload',
        href: '/fonts/ibm-plex-sans-700.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'preload',
        href: '/fonts/Nimbus-Sans-D-OT-Bold-Extended_32745.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
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
    <html lang="en" suppressHydrationWarning className="h-full min-w-[360px] font-sans">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 text-gray-800 antialiased dark:bg-slate-950 dark:text-gray-100">
        <NavigationProgress />
        {/* Skip to main content for keyboard/screen reader users */}
        <a
          href="#content"
          className="focus:ring-primary absolute top-2 left-2 z-[100] -translate-y-20 rounded bg-white px-4 py-2 text-sm font-medium text-gray-900 focus:translate-y-0 focus:ring-2 focus:outline-none dark:bg-slate-900 dark:text-white"
        >
          Skip to main content
        </a>
        {/* Inline theme detection to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const preferredTheme = localStorage.getItem('theme');
              if (preferredTheme === 'dark' || (!preferredTheme && systemDark)) {
                document.documentElement.classList.add('dark');
              }

            `
          }}
        />
        <div className="flex min-h-screen flex-col">{children}</div>
        <Tracking />
        {DevTools && (
          <Suspense fallback={null}>
            <DevTools />
          </Suspense>
        )}
        <Scripts />
      </body>
    </html>
  );
}

function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
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
