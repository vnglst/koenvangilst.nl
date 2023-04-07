import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({
  weight: '900',
  subsets: ['latin'],
  variable: '--font-montserrat'
});

import 'styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <div
        className={`${montserrat.variable} ${inter.variable} font-sans bg-gray-100 dark:bg-gray-900`}
      >
        <Component {...pageProps} />
      </div>
      <Analytics />
    </ThemeProvider>
  );
}
