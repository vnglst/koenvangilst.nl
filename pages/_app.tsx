import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import 'styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
}
