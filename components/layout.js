import Head from 'next/head'
import Link from 'next/link'
import Footer from './footer'

import './styling/font-awesome.css'
import './styling/normalize.css'
import './styling/styles.css'

export default ({ children, title = 'Koen van Gilst', menu = 'home' }) => (
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

    <header>
      <nav>
        <div className="nav-wrapper">
          <span className="terminal">
            <Link href="/">
              <a>
                <i className="fa fa-terminal fa-2x" aria-hidden="true" />
              </a>
            </Link>
          </span>
          <span className="nav-links">
            <Link prefetch href="/">
              <a className={menu === 'home' ? 'active' : null}>Home</a>
            </Link>
            <Link prefetch href="/profile">
              <a className={menu === 'profile' ? 'active' : null}>Profile</a>
            </Link>
            <Link prefetch href="/blog">
              <a className={menu === 'blog' ? 'active' : null}>Blog</a>
            </Link>
          </span>
        </div>
      </nav>
    </header>

    <div className="content">{children}</div>

    <Footer />
  </div>
)
