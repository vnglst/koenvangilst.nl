import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from "next/font/google";

const interVariable = Inter();

import 'styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <div
        className={`${interVariable.className} bg-gray-100 dark:bg-gray-900`}
      >
        <Component {...pageProps} />
      </div>
      <Analytics />
    </ThemeProvider>
  );
}
