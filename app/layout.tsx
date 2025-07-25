import { PropsWithChildren } from 'react';
import { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';

import { Body } from 'components/layout/Body';
import { Tracking } from 'components/Tracking';

import 'styles/global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const fraunces = Fraunces({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-fraunces'
});

const meta = {
  title: 'Koen van Gilst - Tech Lead',
  description: `Innovative tech lead from the Netherlands who likes to push the web beyond its limits.`,
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
  themeColor: '#199acc'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${fraunces.variable} ${inter.variable} h-full min-w-[360px] scroll-smooth font-sans`}
    >
      <link rel="me" href="https://hachyderm.io/@vnglst" />
      <link rel="alternate" type="application/rss+xml" href="https://koenvangilst.nl/feed.xml" />
      <Body>{children}</Body>
      <Tracking />
    </html>
  );
}
