import { Inter, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({
  weight: '900',
  subsets: ['latin'],
  variable: '--font-montserrat'
});

import 'styles/global.css';
import Nav from 'components/Nav';

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={`
      ${montserrat.variable} ${inter.variable} font-sans min-w-[360px] scroll-smooth md:overflow-x-scroll bg-gray-100 dark:bg-gray-900 
      `}
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
        <Nav />
        <main
          id="content"
          className="flex flex-col justify-center px-8 bg-gray-50 dark:bg-gray-900 pt-8 md:pt-16 bg-gradient-to-b from-white dark:from-black to-gray-100 dark:to-gray-900 min-h-screen break-words"
        >
          {children}
        </main>
      </body>
      <Analytics />
    </html>
  );
}
