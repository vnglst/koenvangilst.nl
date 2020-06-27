
export default () => (
  <footer>
    <div className="footer-content">
      <span className="social-links">
        <a href="https://twitter.com/vnglst" title="Follow me on Twitter">
          <i className="fa fa-lg fa-twitter" style={{ color: '#4099FF' }} />
          Twitter
        </a>
        <a href="https://github.com/vnglst" title="View code samples on GitHub">
          <i className="fa fa-lg fa-github" style={{ color: '#36382E' }} />
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/vangilst/"
          title="View my resume on LinkedIn"
        >
          <i className="fa fa-lg fa-linkedin" style={{ color: '#007BB6' }} />
          LinkedIn
        </a>
      </span>
      <span className="source">
        <a
          href="https://github.com/vnglst/koenvangilst.nl"
          title="Source code website"
        >
          {`<SourceCode/>`}
        </a>
      </span>
    </div>
  </footer>
)
