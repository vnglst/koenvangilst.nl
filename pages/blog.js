import Layout from '../components/layout'
import Creations from '../components/creations'
import Link from 'next/link'

export default () => (
  <Layout title="Blog | Koen van Gilst" menu="blog">
    <Creations>
      <Creations.Item fullWidth>
        <h1>Blog articles</h1>
        <p>
          A selection of articles. More articles can be found on{' '}
          <a href="https://medium.com/@vnglst/latest">Medium</a>.
        </p>
      </Creations.Item>
      {/* <Creations.Item>
        <h1>CSS In Depth (notes)</h1>
        <p>Some of my reading notes when reading XY's new book on CSS.</p>
        <span className="links">
          <Link prefetch href="/blog/css-in-depth">
            <a>Read it here [2018]</a>
          </Link>{' '}
        </span>
      </Creations.Item> */}
      <Creations.Item>
        <h1>API Testing with Jest</h1>
        <p>
          Jest is a great JavaScript testing framework by Facebook. It’s often
          used for testing React components, but it’s also a pretty good general
          purpose testing framework. Appeared in Hackernoon.
        </p>
        <span className="links">
          <a href="https://hackernoon.com/api-testing-with-jest-d1ab74005c0a#.8yd4cfvvg">
            Read it here
          </a>{' '}
          [<b>2017</b>]
        </span>
      </Creations.Item>
      <Creations.Item>
        <h1>Generating PDF's with Node</h1>
        <p>
          A fun little Node tutorial I wrote on how to generate PDF's from a web
          form using Express and Node. You can easily deploy it with Now.
          Appeared in <a href="http://nodeweekly.com/issues/163">Node Weekly</a>{' '}
          on November 10th.
        </p>
        <span className="links">
          <Link prefetch href="/blog/node-pdf">
            <a>Read it here</a>
          </Link>{' '}
          [<b>2016</b>]
        </span>
      </Creations.Item>
    </Creations>
  </Layout>
)
