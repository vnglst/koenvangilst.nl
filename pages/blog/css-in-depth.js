import Layout from '../../components/layout'
import SyntaxHighlighter, {
  registerLanguage
} from 'react-syntax-highlighter/light'
import xml from 'react-syntax-highlighter/languages/hljs/xml'
import css from 'react-syntax-highlighter/languages/hljs/css'
import tomorrowNight from 'react-syntax-highlighter/styles/hljs/tomorrow-night'

registerLanguage('css', css)
registerLanguage('xml', xml)

export default () => (
  <Layout title="CSS In Depth (notes) | Koen van Gilst" menu="blog">
    <section className="creations">
      <div className="wrapper">
        <div className="project project--double">
          <h1>CSS In Depth (notes)</h1>
          <p className="date">Published Sep, 2018</p>
          <p>
            Hoping that I will never forget the following -- and if I do I can
            always lookup these snippets.
          </p>
          <p>Some general tips:</p>
          <ul>
            <li>
              Don't set fixed heights (like height: 100%). Let the browser take
              care of that.
            </li>
            <li>
              Use relative units (i.e. <code>em</code> and <code>rem</code> for
              sizes and avoid using <code>px</code>. See code samples below on
              how to do this responsively.
            </li>
            <li>
              Be aware of margin collapsing: of the top and bottom margin
              between two elements the browsers picks the largest and ignores
              that other one, i.e. only one margin is applied. This doesn't
              happen when using flexbox or when setting padding and/or border
              size.
            </li>
            <li>
              You can add a margin to all items except the first with a so
              called 'lobotomized owl' using{' '}
              <code>{`* + * { margin-left: 1em; }`}</code>
            </li>
          </ul>
        </div>

        <div className="project project--double">
          <h2>Template</h2>
          <p>HTML</p>
          <SyntaxHighlighter language="html" style={tomorrowNight}>
            {``.trim()}
          </SyntaxHighlighter>
          <p>CSS</p>
          <SyntaxHighlighter language="css" style={tomorrowNight}>
            {``.trim()}
          </SyntaxHighlighter>
        </div>

        <div className="project project--double">
          <h2>Fixed height columns.</h2>
          <p>HTML</p>
          <SyntaxHighlighter language="html" style={tomorrowNight}>
            {`
<div class="container">
  <main class="main">...</main>
  <aside class="sidebar">...</aside>
</div>`.trim()}
          </SyntaxHighlighter>
          <p>
            CSS using flexbox, this will make sure that all columns have the
            same height. This doesn't happen when using floats.
          </p>
          <SyntaxHighlighter language="css" style={tomorrowNight}>
            {`
.container {
  display: flex;
}

.main {
  width 70%;
}

.sidebar {
  width: 30%;
  padding: 1.5em;
  margin-left: 1.5em;
}`.trim()}
          </SyntaxHighlighter>
        </div>

        <div className="project project--double">
          <h2>Flexbox nav bar</h2>
          <p>With the following html</p>
          <SyntaxHighlighter language="html" style={tomorrowNight}>
            {`
<nav>
  <ul class="site-nav">
      <li><a href="#">Home</a></li>
      <li><a href="#">Item1</a></li>
      <li><a href="#">Item2</a></li>
      <li class="nav-right"><a href="#">About</a></li>
  </ul>
</nav>
          `.trim()}
          </SyntaxHighlighter>
          <p>Using this css to create a commonly used nav bar</p>
          <SyntaxHighlighter language="css" style={tomorrowNight}>
            {`
.site-nav {
  display: flex;
  padding-left: 0;
  list-style-type: none;
}

.site-nav > li > a {
  display: block;
  padding: 0.5em 1em;
  text-decoration: none;
}

.site-nav > li + li {
  /* every list item that follows another, i.e. all but the first */
  margin-left: 1.5em;
}

.site-nav > .nav-right {
  margin-left: auto;
}`.trim()}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  </Layout>
)
