import { PropsWithChildren } from 'react';
import { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';

import { Footer } from 'components/Footer';
import { Nav } from 'components/Nav';
import { Tracking } from 'components/Tracking';

import 'styles/global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const montserrat = Montserrat({
  weight: '900',
  subsets: ['latin'],
  variable: '--font-montserrat'
});

const meta = {
  title: 'Koen van Gilst - TypeScript Developer',
  description: `Passionate & entrepreneurial TypeScript developer from the Netherlands`,
  image: 'https://koenvangilst.nl/static/images/banner.png'
};

export const metadata: Metadata = {
  title: {
    template: '%s | Koen van Gilst',
    absolute: meta.title
  },
  metadataBase: new URL('https://koenvangilst.nl'),
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: 'https://koenvangilst.nl',
    siteName: 'Koen van Gilst',
    images: [
      {
        url: meta.image,
        width: 1820,
        height: 904
      }
    ],
    type: 'website',
    locale: 'en-US'
  },
  alternates: {
    canonical: 'https://koenvangilst.nl'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vnglst',
    title: meta.title,
    description: meta.description,
    images: [meta.image]
  },
  referrer: 'origin-when-cross-origin',
  keywords: ['Koen van Gilst', 'Web Developer', 'JavaScript'],
  authors: [{ name: 'Koen van Gilst', url: 'https://koenvangilst.nl' }],
  creator: 'Koen van Gilst',
  icons: {
    icon: [
      {
        rel: 'icon',
        url: '/static/favicons/favicon-32x32.png',
        sizes: '32x32'
      },
      {
        rel: 'icon',
        url: '/static/favicons/favicon-16x16.png',
        sizes: '16x16'
      }
    ],
    shortcut: {
      rel: 'shortcut icon',
      url: '/static/favicons/favicon.ico'
    },
    other: {
      rel: 'apple-touch-icon',
      url: '/static/favicons/apple-touch-icon.png',
      sizes: '180x180'
    }
  },
  manifest: '/static/favicons/site.webmanifest'
};

export const viewport: Viewport = {
  themeColor: '#5bc3eb'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${montserrat.variable} ${inter.variable} min-w-[360px] scroll-smooth font-sans md:overflow-x-scroll`}
    >
      <link rel="me" href="https://hachyderm.io/@vnglst" />
      <link
        rel="alternate"
        type="application/rss+xml"
        href="https://koenvangilst.nl/feed.xml"
      ></link>
      <body className="bg-white text-white dark:bg-black dark:text-black">
        <script
          defer
          id="theme"
          dangerouslySetInnerHTML={{
            __html: `

            // This script is responsible for setting the correct theme on page load.
            // This has to be done in the head to avoid a flash of the wrong mode
            // (sometimes also referred to as FOUC, or Flash of Unstyled Content).
            // The theme is set by adding the 'dark' class to the <html> element.

            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const preferredTheme = localStorage.getItem('theme');

            if (preferredTheme) {
              if (preferredTheme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } else if (systemDark) {
              document.documentElement.classList.add('dark');
            }
          `
          }}
        />
        <Nav />
        <main
          id="content"
          className="flex min-h-screen flex-col break-words bg-gray-50 bg-gradient-to-b from-white to-gray-100 px-8 pt-8 md:pt-16 dark:bg-gray-900 dark:from-black dark:to-gray-900"
        >
          {children}
        </main>
        <Footer />
      </body>
      <Tracking />
    </html>
  );
}
