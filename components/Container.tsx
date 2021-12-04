import Head from 'next/head';
import { useRouter } from 'next/router';

import Footer from 'components/Footer';
import Nav from 'components/Nav';

export default function Container(props) {
  const { children, ...customMeta } = props;
  const router = useRouter();
  const meta = {
    title: 'Koen van Gilst – TypeScript Developer',
    description: `Passionate & entrepreneurial TypeScript developer from the Netherlands`,
    image: 'https://koenvangilst.nl/static/images/banner.png',
    type: 'website',
    ...customMeta
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://koenvangilst.nl${router.asPath}`}
        />
        <link
          rel="canonical"
          href={`https://koenvangilst.nl${router.asPath}`}
        />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Koen van Gilst" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vnglst" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      <Nav />
      <main
        id="content"
        className="flex flex-col justify-center px-8 bg-gray-50 dark:bg-gray-900 pt-8 md:pt-16"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
