import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Tracking } from '#/components/Tracking'

interface MyRouterContext {
  queryClient: QueryClient
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
          'Innovative tech lead from the Netherlands, specialising in AI, developer tooling, and building high-performing engineering teams.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preconnect',
        href: 'https://plausible.koenvangilst.nl',
        crossOrigin: 'anonymous',
      },
      { rel: 'me', href: 'https://hachyderm.io/@vnglst' },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: 'https://koenvangilst.nl/feed.xml',
      },
      {
        rel: 'icon',
        href: '/static/favicons/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        href: '/static/favicons/favicon-16x16.png',
        sizes: '16x16',
      },
      { rel: 'shortcut icon', href: '/static/favicons/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        href: '/static/favicons/apple-touch-icon.png',
        sizes: '180x180',
      },
      { rel: 'manifest', href: '/static/favicons/site.webmanifest' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full min-w-[360px] scroll-smooth font-sans"
    >
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 text-gray-800 antialiased dark:bg-slate-950 dark:text-gray-100">
        {/* Inline theme detection to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const preferredTheme = localStorage.getItem('theme');
              if (preferredTheme === 'dark' || (!preferredTheme && systemDark)) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
        {children}
        <Tracking />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

