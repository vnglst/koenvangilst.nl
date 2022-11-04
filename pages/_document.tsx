import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html
      lang="en"
      className="min-w-[360px] scroll-smooth md:overflow-x-scroll"
    >
      <Head>
        <link
          rel="preload"
          href="/fonts/montserrat.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
      </Head>
      <body className="bg-white dark:bg-black text-white dark:text-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
