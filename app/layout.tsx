import 'styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/ibm-plex-sans-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link href="/static/favicons/favicon.ico" rel="shortcut icon" />
        <link href="/static/favicons/site.webmanifest" rel="manifest" />
        <link href="/static/favicons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/static/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/static/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link color="#5bc3eb" href="/static/favicons/safari-pinned-tab.svg" rel="mask-icon" />
        <meta content="#5bc3eb" name="theme-color" />
        <meta content="#5bc3eb" name="msapplication-TileColor" />
        <meta content="/static/favicons/browserconfig.xml" name="msapplication-config" />
        <meta content="14d2e73487fa6c71" name="yandex-verification" />
        <meta
          content="eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw"
          name="google-site-verification"
        />
      </head>
      <body className="bg-white dark:bg-black text-white dark:text-black">{children}</body>
    </html>
  );
}
