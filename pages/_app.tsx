import { useAnalytics } from 'lib/analytics';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import 'styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
