import Head from 'next/head'
import Link from 'next/link'

export default ({ children, title = 'Koen van Gilst' }) =>
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
      <link rel='stylesheet' href='static/css/normalize.css' />
      <link rel='stylesheet' href='static/css/font-awesome.min.css' />
      <link rel='stylesheet' href='static/css/main.css' />
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
              <a>Home </a>
            </Link>
            <Link prefetch href='/profile'>
              <a>&nbsp; Profile </a>
            </Link>
            <Link prefetch href='/blog'>
              <a>&nbsp; Blog</a>
            </Link>
          </span>
        </div>
      </nav>
    </header>

    {children}

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
          />&nbsp; Twitter
        </a>
          <a
            target='_blank'
            href='https://github.com/vnglst'
            title='View code samples on GitHub'
        >
            <i
              className='fa fa-lg fa-github'
              style={{ color: '#36382E' }}
          />&nbsp; GitHub
        </a>
          <a
            target='_blank'
            href='https://www.linkedin.com/in/vangilst/'
            title='View my resume on LinkedIn'
        >
            <i
              className='fa fa-lg fa-linkedin'
              style={{ color: '#007BB6' }}
          />&nbsp; LinkedIn
        </a>
        </span>
        <span className='attibution'>
        Website design inspired by the awesome{' '}
          <a
            target='_blank'
            href='https://twitter.com/twholman'
            title='Awesome Tim Holman'
        >
          @twholman
        </a>.
      </span>
      </div>
    </footer>
  </div>
