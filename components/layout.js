import Head from "next/head";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default ({ children, title = "Koen van Gilst", menu = "home" }) => (
  <div>
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ff6600" />
      <meta name="apple-mobile-web-app-title" content="koenvangilst.nl" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link
        rel="shortcut icon"
        type="image/png"
        href="/static/img/favicon.ico"
      />
    </Head>

    <Navigation menu={menu} />

    <main className="max-w-2xl mx-auto md:grid md:gap-3 md:grid-cols-2">
      {children}
    </main>

    <Footer />
  </div>
);
