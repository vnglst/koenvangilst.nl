import 'styles/global.css';
import Script from 'next/script';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { useAnalytics } from 'lib/analytics';

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
          ga('create', 'UA-136403234-1', 'auto');
          ga('send', 'pageview');
        `}
      </Script>
      <Script
        src="https://www.google-analytics.com/analytics.js"
        strategy="afterInteractive"
      />
    </ThemeProvider>
  );
}
