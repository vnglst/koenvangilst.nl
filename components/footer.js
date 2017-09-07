import { footer } from './styles'

export default () =>
  <footer>
    <style jsx>
      {footer}
    </style>
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