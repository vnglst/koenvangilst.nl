import Head from 'next/head'
import Link from 'next/link'
import Analytics from './analytics'

export default ({ children, title = 'Koen van Gilst', menu = 'home' }) =>
  <div>
    <Head>
      <meta charset='utf-8' />
      <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1' />
      <title>
        {title}
      </title>
      <meta
        name='google-site-verification'
        content='LRaILkORB_X4mP7mG-Qfct597xXWzzzqfMG0XK6LXWI'
      />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='stylesheet' href='/static/css/normalize.css' />
      <link rel='stylesheet' href='/static/css/font-awesome.min.css' />
      <link rel='stylesheet' href='/static/css/main.css' />
      <link
        rel='shortcut icon'
        type='image/png'
        href='/static/img/favicon.ico'
      />
    </Head>

    <header>
      <nav>
        <div className='nav-wrapper'>
          <span className='terminal'>
            <Link href='/'>
              <a>
                <i className='fa fa-terminal fa-2x' aria-hidden='true' />
              </a>
            </Link>
          </span>
          <span className='nav-links'>
            <Link prefetch href='/'>
              <a className={menu === 'home' ? 'active' : null}>Home</a>
            </Link>
            <Link prefetch href='/profile'>
              <a className={menu === 'profile' ? 'active' : null}>Profile</a>
            </Link>
            <Link prefetch href='/blog'>
              <a className={menu === 'blog' ? 'active' : null}>Blog</a>
            </Link>
          </span>
        </div>
      </nav>
    </header>

    <div className='content'>
      {children}
    </div>

    <footer>
      <div className='footer-content'>
        <span className='social-links'>
          <a
            target='_blank'
            href='https://twitter.com/vnglst'
            title='Follow me on Twitter'
          >
            <i
              className='fa fa-lg fa-twitter'
              style={{ color: '#4099FF' }}
            />Twitter
          </a>
          <a
            target='_blank'
            href='https://github.com/vnglst'
            title='View code samples on GitHub'
          >
            <i
              className='fa fa-lg fa-github'
              style={{ color: '#36382E' }}
            />GitHub
          </a>
          <a
            target='_blank'
            href='https://www.linkedin.com/in/vangilst/'
            title='View my resume on LinkedIn'
          >
            <i
              className='fa fa-lg fa-linkedin'
              style={{ color: '#007BB6' }}
            />LinkedIn
          </a>
        </span>
        <span className='attribution'>
          Design inspired by{' '}
          <a
            target='_blank'
            href='http://tholman.com/'
            title='Awesome Tim Holman'
          >
            Tim Holman
          </a>
        </span>
      </div>
    </footer>
    <Analytics />
  </div>
