import { FC } from "react";
import Head from "next/head";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface Props {
  title: string;
  menu: string;
}

const Layout: FC<Props> = ({
  children,
  title = "Koen van Gilst",
  menu = "home",
}) => {
  return (
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
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap"
          rel="stylesheet"
        />

        <link
          rel="shortcut icon"
          type="image/png"
          href="/static/img/favicon.ico"
        />
      </Head>

      <Navigation menu={menu} />

      <main className="max-w-2xl mx-auto md:grid md:gap-2 md:grid-cols-2">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
