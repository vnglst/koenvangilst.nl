import Layout from '../components/layout'
import Link from 'next/link'

export default () => (
  <Layout title="JavaScript Labs | Koen van Gilst" menu="home">
    <section className="creations">
      <div className="wrapper">
        <div className="project project--double">
          <h1>Hi there!</h1>
          <p>
            My name is <b>Koen van Gilst</b> and I'm a JavaScript developer who
            loves creating funny Twitter bots, useful web apps for translators
            and other creative stuff.
          </p>
          <p>
            Have a look at my{' '}
            <Link prefetch href="/profile">
              <a>profile</a>
            </Link>{' '}
            if you're interested in working with me. Or else feel free to browse
            through my experiments, projects and tutorials below.
          </p>
          <p>
            You can also find me on
            <a href="https://github.com/vnglst"> Github</a>,
            <a href="http://nl.linkedin.com/in/vangilst/"> LinkedIn</a> and
            <a href="http://www.twitter.com/vnglst"> Twitter</a>. Or send me an{' '}
            <a href="&#x6d;&#x61;&#x69;&#108;&#116;&#111;&#x3a;&#107;&#x6f;&#x65;&#x6e;&#x40;&#x6b;&#x6f;&#x65;&#x6e;&#x76;&#97;&#x6e;&#x67;&#x69;&#108;&#x73;&#116;&#x2e;&#x6e;&#x6c;">
              email
            </a>.
          </p>
          <span className="links">Have fun!</span>
        </div>
        <div className="project">
          <h1>Finding Nora</h1>
          <p>
            I created this fun little PWA for my daughter Nora to help her spell
            her name. She loved it, hope you do too!
          </p>
          <ul style={{ padding: 0, listStyleType: 'none' }}>
            <li>
              🚀 <code>create-react-app</code> + TypeScript
            </li>
            <li>⛺ full offline support</li>
            <li>🎺 web audio for sounds</li>
          </ul>

          <span className="links">
            <a href="https://nora.now.sh">Play</a> +{' '}
            <a href="https://github.com/vnglst/finding-nora">Source</a> [<b>
              2018
            </b>]
          </span>
        </div>
        <div className="project">
          <h1>MyTommy Loyalty App</h1>
          <p>
            For Tommy Hilfiger I worked in a Scrum team as a fullstack
            JavaScript developer on their loyality app <b>MyTommy</b>.
          </p>
          <span className="links">
            <Link prefetch href="/hilfiger">
              <a>Demo page (in Dutch)</a>
            </Link>{' '}
            [<b>2018</b>]
          </span>
        </div>
        <div className="project">
          <h1>Faster Than Max</h1>
          <p>
            Are you faster than Max Verstappen? Test your reaction speed with
            this iPhone app. Simple React Native iOS app.
          </p>
          <span className="links">
            <a href="https://itunes.apple.com/nl/app/faster-than-max/id1279729114?mt=8">
              Open in App Store
            </a>{' '}
            + <a href="https://github.com/vnglst/sneller-dan-max">Source</a> [<b
            >
              2017
            </b>]
          </span>
        </div>
        <div className="project">
          <h1>Audio Books Player</h1>
          <p>
            For Dedicon I created a player for their audio books collections,
            it's designed specifically for users with visual impairments. The
            player also has a karaoke function that highlights the text
            currently being read for children with dyslexia.
          </p>
          <span className="links">
            <Link prefetch href="/dedicon">
              <a>Demo page (in Dutch)</a>
            </Link>{' '}
            [<b>2017</b>]
          </span>
        </div>
        <div className="project">
          <h1>Star Wars or Star Trek?</h1>
          <p>
            Why not both? Using just CSS and a bit of JavaScript I recreated
            these classic science fiction intro's.
          </p>
          <span className="links">
            <a href="http://startrek.koenvangilst.nl">Star Trek</a> +{' '}
            <a href="https://github.com/vnglst/startrek ">Source</a>
            <br />
            <a href="http://starwars.koenvangilst.nl">Star Wars</a> +{' '}
            <a href="https://github.com/vnglst/starwars">Source</a> [<b>2017</b>]
          </span>
        </div>
        <div className="project">
          <h1>Shortcut Trainer</h1>
          <p>
            Quickly learn the 10 most commonly used keyboard shortcuts for the
            translation CAT tool MemoQ. Weekend project using React.
          </p>
          <span className="links">
            <a href="http://shortcut-trainer.koenvangilst.nl/">Demo</a> +{' '}
            <a href="https://github.com/vnglst/shortcut-trainer">Source</a> [<b>
              2016
            </b>]
          </span>
        </div>
        <div className="project">
          <h1>LaTeX Letters</h1>
          <p>
            Creating beautiful PDF letters using LaTeX in a Docker container on
            a server.
          </p>
          <span className="links">
            <a href="https://github.com/vnglst/latex-letter">Source code</a> [
            <b>2016</b>]
          </span>
        </div>
        <div className="project">
          <h1>Rush hour timelapse</h1>
          <p>
            A Twitter bot that creates daily timelapse videos of the traffic
            jams in The Netherlands. No longer active, but you can still see
            some of the old timelapses.
          </p>
          <span className="links">
            <a href="https://twitter.com/altijdfiles">@altijdfiles</a> +{' '}
            <a href="https://github.com/vnglst/spitsuur">Source</a> [<b>2016</b>]
          </span>
        </div>
        <div className="project">
          <h1>Term Search</h1>
          <p>
            A terminology search engine for translators. Currently only
            German-Dutch terms. Work in progress.
          </p>
          <p>Technologies: NodeJS, Express, MongoDB, Loopback, ReactJS.</p>
          <span className="links">
            <a href="https://term-search.nl/">Visit website</a> +{' '}
            <a href="https://github.com/TermSearch">Source</a> [<b>2016</b>]
          </span>
        </div>
        <div className="project">
          <h1>Help Terence!</h1>
          <p>
            A Twitter bot raising emoji money for his trip around the world. Fun
            little experiment with social media and Twitter bots.
          </p>
          <p>Technologies used: Express, MongoDB.</p>
          <span className="links">
            <a href="https://twitter.com/helpTerence"> @helpTerence </a> +{' '}
            <a href="https://github.com/vnglst/HelpTerence">Source</a> [<b>
              2016
            </b>]
          </span>
        </div>
        <div className="project">
          <h1>Word to Line Prices</h1>
          <p>
            A simple web app for translators that converts a price per word to a
            price per standard line (55 characters).
          </p>
          <span className="links">
            <a href="http://converter.vangilst.de/">Visit the app</a> +{' '}
            <a href="https://github.com/vnglst/converter2">Source</a> [<b>
              2016
            </b>]
          </span>
        </div>
        {/* <div className='project'>
          <a href='http://cost-analysis.koenvangilst.nl/'>costAnalysis</a>: An
          app for freelance translators to get an idea of the amount of work
          involved in a translation (hours) and what they should be charging
          their clients. [<b>2014</b>]
        </div> */}
        <div className="project">
          <h1>Wikipedia edits by the Dutch government</h1>
          <p>
            Twitter bot inspired by{' '}
            <a href="https://twitter.com/congressedits">@congressedits</a> that
            monitors and Tweets any edits made to Wikipedia by the Dutch
            government.
          </p>
          <span className="links">
            <a href="https://twitter.com/OverheidEdits">@OverheidEdits</a> +{' '}
            <a href="https://github.com/vnglst/OverheidEdits">Source</a> [<b>
              2013
            </b>]
          </span>
        </div>
        <div className="project">
          <h1>Starfield</h1>
          <p>
            I once wrote this program in assembly, but this time I wanted to do
            it in Javascript.
          </p>
          <span className="links">
            <a href="http://starfield.koenvangilst.nl/">Demo</a> [<b>2013</b>]
          </span>
        </div>
        <div className="project">
          <h1>Dawkins' Trees</h1>
          <p>
            For this web app I've tried to recreate (in part) the program
            Richard Dawkins describes in his book The Blind Watchmaker.
          </p>
          <span className="links">
            <a href="http://dawkins.koenvangilst.nl/">Demo</a> [<b>2013</b>]
          </span>
        </div>
      </div>
    </section>
  </Layout>
)
