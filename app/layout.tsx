import { Analytics } from '@vercel/analytics/react';
import { Inter, Montserrat } from 'next/font/google';

import Footer from 'components/Footer';
import Nav from 'components/Nav';

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

export const metadata = {
  title: {
    template: '%s | Koen van Gilst',
    absolute: meta.title
  },
  description: meta.description,
  openGraph: {
    images: [meta.image],
    type: 'website'
  },
  alternates: {
    canonical: 'https://koenvangilst.nl',
    types: {
      'application/rss+xml': 'https://koenvangilst.nl/rss.xml'
    }
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vnglst',
    title: meta.title,
    description: meta.description,
    images: [meta.image]
  }
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${montserrat.variable} ${inter.variable} font-sans min-w-[360px] scroll-smooth md:overflow-x-scroll`}
    >
      <link href="/static/favicons/favicon.ico" rel="shortcut icon" />
      <link href="/static/favicons/site.webmanifest" rel="manifest" />
      <link
        href="/static/favicons/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/static/favicons/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/static/favicons/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link
        color="#5bc3eb"
        href="/static/favicons/safari-pinned-tab.svg"
        rel="mask-icon"
      />
      <meta content="#5bc3eb" name="theme-color" />
      <meta content="#5bc3eb" name="msapplication-TileColor" />
      <meta
        content="/static/favicons/browserconfig.xml"
        name="msapplication-config"
      />
      <link rel="me" href="https://maakr.social/@koen" />
      <body className="bg-white dark:bg-black text-white dark:text-black">
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
          className="flex flex-col px-8 bg-gray-50 dark:bg-gray-900 pt-8 md:pt-16 bg-gradient-to-b from-white dark:from-black to-gray-100 dark:to-gray-900 min-h-screen break-words"
        >
          {children}
        </main>
        <Footer />
      </body>
      <Analytics />
    </html>
  );
}
