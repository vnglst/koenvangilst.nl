import Layout from '../components/layout'
import Link from 'next/link'

export default () =>
  <Layout>
    <section className='creations'>
      <div className='wrapper'>
        <div className='project project--double'>
          <h1>Hi there!</h1>
          <p>
            My name is <b>Koen van Gilst</b> and I'm a JavaScript developer who loves
            creating funny Twitter bots, handy web apps for translators and
            stunning movie intro's in css.
          </p>
          <p>
            Have a look at my{' '}
            <Link prefetch href='/profile'>
              <a>profile</a>
            </Link>{' '}
            if you're interested in working with me. Or else feel free to browse
            through my experiments, projects and tutorials below.
          </p>
          <p>
            You can also find me on
            <a href='https://github.com/vnglst'> Github</a>,
            <a href='http://nl.linkedin.com/in/vangilst/'> LinkedIn</a> and
            <a href='http://www.twitter.com/vnglst'> Twitter</a>. Or send me an{' '}
            <a href='&#x6d;&#x61;&#x69;&#108;&#116;&#111;&#x3a;&#107;&#x6f;&#x65;&#x6e;&#x40;&#x6b;&#x6f;&#x65;&#x6e;&#x76;&#97;&#x6e;&#x67;&#x69;&#108;&#x73;&#116;&#x2e;&#x6e;&#x6c;'>
              email
            </a>.
          </p>
          <span className='links'>Have fun!</span>
        </div>
        <div className='project'>
          <h1>Star Wars or Star Trek?</h1>
          <p>
            Why not both? Using just CSS and some JavaScript I recreated these
            classic science fictions intro's. [<b>2017</b>]
          </p>
          <span className='links'>
            <a href='http://startrek.koenvangilst.nl'> Star Trek </a> +{' '}
            <a href='https:/ / github.com / vnglst / starwars '>source</a>
            <br />
            <a href='http://starwars.koenvangilst.nl'> Star Wars </a> +{' '}
            <a href='https://github.com/vnglst/startrek '>source</a>
          </span>
        </div>
        <div className='project'>
          <h1>API Testing with Jest</h1>
          <p>
            Jest is a great JavaScript testing framework by Facebook. It’s often
            used for testing React components, but it’s also a pretty good
            general purpose testing framework. Appeared in Hackernoon [<b>2017</b>].
          </p>
          <span className='links'>
            <a href='https://hackernoon.com/api-testing-with-jest-d1ab74005c0a#.8yd4cfvvg'>
              Read it here
            </a>
          </span>
        </div>
        <div className='project'>
          <h1>Generating PDF's with Node</h1>
          <p>
            A fun little Node tutorial I wrote on how to generate PDF's from a
            web form using Express and Node. And how to deploy this using Now.
            Appeared in
            <a href='http://nodeweekly.com/issues/163'> Node Weekly </a> on
            November 10th [<b>2016</b>].
          </p>
          <span className='links'>
            <a href='https://edgecoders.com/generating-a-pdf-with-express-in-node-js-d3ff5107dff1#.xrky44qvu'>
              Read it here
            </a>
          </span>
        </div>
        <div className='project'>
          <h1>Shortcut Trainer</h1>
          <p>
            Quickly learn the 10 most commonly used keyboard shortcuts for the
            translation CAT tool MemoQ. Weekend project using React.
            <a href='https://github.com/vnglst/shortcut-trainer'>
              {' '}Source code
            </a>. [<b>2016</b>]
          </p>
          <span className='links'>
            <a href='http://shortcut-trainer.koenvangilst.nl/'>Demo</a>
          </span>
        </div>
        {/* <div className='project'>
          <h1>LaTeX Letters</h1>
          <p>
            Creating beautiful PDF letters using LaTeX in a Docker container on
            a server.
          </p>
          <a href='https://github.com/vnglst/latex-letter'>Source code</a>. [
          <b>2016</b>]
        </div> */}
        <div className='project'>
          <h1>Traffic jams</h1>
          <p>
            A Twitter bot that creates daily timelapse videos of the traffic
            jams in The Netherlands. No longer active, but you can still see
            some of the old timelapses. [<b>2016</b>]
          </p>
          <span className='links'>
            <a href='https://twitter.com/altijdfiles'>@altijdfiles</a> +{' '}
            <a href='https://github.com/vnglst/spitsuur'>source</a>
          </span>
        </div>
        <div className='project'>
          <h1>Term Search</h1>
          <p>
            A terminology search engine for translators. Currently only
            German-Dutch terms. Work in progress. [<b>2016</b>]
          </p>
          <p>Technologies: NodeJS, Express, MongoDB, Loopback, ReactJS.</p>
          <span className='links'>
            <a href='https://term-search.nl/'>Visit website</a> +{' '}
            <a href='https://github.com/TermSearch'>source</a>
          </span>
        </div>
        <div className='project'>
          <h1>Help Terence!</h1>
          <p>
            A Twitter bot raising emoji money for his trip around the world. Fun
            little experiment with social media and Twitter bots. [<b>2016</b>]
          </p>
          <p>Technologies used: Express, MongoDB.</p>
          <span className='links'>
            <a href='https://twitter.com/helpTerence'> @helpTerence </a> +{' '}
            <a href='https://github.com/vnglst/HelpTerence'>source</a>
          </span>
        </div>
        <div className='project'>
          <h1>Word to Line Prices</h1>
          <p>
            A simple web app for translators that converts a price per word to a
            price per standard line (55 characters). [<b>2016</b>]
          </p>
          <span className='links'>
            <a href='http://converter.vangilst.de/'>Visit the app</a> +{' '}
            <a href='https://github.com/vnglst/converter2'>source</a>
          </span>
        </div>
        {/* <div className='project'>
          <a href='http://cost-analysis.koenvangilst.nl/'>costAnalysis</a>: An
          app for freelance translators to get an idea of the amount of work
          involved in a translation (hours) and what they should be charging
          their clients. [<b>2014</b>]
        </div> */}
        <div className='project'>
          <h1>Wikipedia edits by the Dutch government</h1>
          <p>
            Twitter bot inspired by{' '}
            <a href='https://twitter.com/congressedits'>@congressedits</a> that
            monitors and Tweets any edits made to Wikipedia by the Dutch
            government. [<b>2013</b>]
          </p>
          <span className='links'>
            <a href='https://twitter.com/OverheidEdits'>@OverheidEdits</a> +{' '}
            <a href='https://github.com/vnglst/OverheidEdits'>source</a>
          </span>
        </div>
        {/* <div className='project'>
          <a href='http://starfield.koenvangilst.nl/'>Starfield</a>: I once
          wrote this program in assembly, but this time I wanted to do it in
          Javascript. [<b>2013</b>]
        </div> */}
        <div className='project'>
          <h1>Dawkins' Trees</h1>
          <p>
            For this web app I've tried to recreate (in part) the program
            Richard Dawkins describes in his book The Blind Watchmaker. [<b>2013</b>]
          </p>
          <span className='links'>
            <a href='http://dawkins.koenvangilst.nl/'>Demo</a>
          </span>
        </div>
      </div>
    </section>
  </Layout>
