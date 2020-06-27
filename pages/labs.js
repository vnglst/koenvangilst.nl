import Layout from "../components/layout";
import Card from "../components/Card";

export default () => (
  <Layout title="JavaScript Labs | Koen van Gilst" menu="labs">
    <Card extraClasses="col-span-2">
      <h1>JavaScript Labs</h1>
      <p>
        Below you'll find a collection of my (more recent) JavaScript
        experiments. It's mostly educational progressive web apps, some Twitter
        bots and other creative stuff. I generally use these experiments to
        learn more about a certain technology or library, so don't take the code
        too seriously. 🐒
      </p>
      <p>
        Feel free to drop me a line on{" "}
        <a href="http://www.twitter.com/vnglst">Twitter</a> if you like them!
      </p>
      <Card.Footer>Have fun!</Card.Footer>
    </Card>

    {/* <Card>
      <h2>Decentralized Chat</h2>
      <p>
        A new year, a new JavaScript framework! Using <code>svelte</code> I
        created this PWA to help my kids with math. Goal was to create an
        app-like experience:
      </p>
      <ul className="list-none mb-2">
        <li>💃 micro animations</li>
        <li>⛺ full offline support</li>
        <li>⌛ prefetching JavaScript</li>
        <li>💻 server side rendering</li>
      </ul>
      <Card.Footer>
        <a href="https://tafels.app">Play</a> +{" "}
        <a href="https://github.com/vnglst/tafels.app">Source</a> [<b>2020</b>]
      </Card.Footer>
    </Card> */}

    <Card>
      <h2>Tafels.App</h2>
      <p>
        A new year, a new JavaScript framework! Using <code>svelte</code> I
        created this PWA to help my kids with math. Goal was to create an
        app-like experience:
      </p>
      <ul className="list-none mb-2">
        <li>💃 micro animations</li>
        <li>⛺ full offline support</li>
        <li>⌛ prefetching JavaScript</li>
        <li>💻 server side rendering</li>
      </ul>
      <Card.Footer>
        <a href="https://tafels.app">Play</a> +{" "}
        <a href="https://github.com/vnglst/tafels.app">Source</a> [<b>2020</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Lumber Jack</h2>
      <p>
        Weekend project to learn more about Mobx State Tree. Simple kids game
        inspired by Stardew Valley and Monty Python. Don't forget to turn on
        sound!
      </p>
      <ul className="list-none mb-2">
        <li>🌳 mobx state tree</li>
        <li>💃 react pose for animations</li>
        <li>
          🚀 <code>create-react-app</code> + TypeScript
        </li>
        <li>🎺 web audio for sounds</li>
      </ul>
      <Card.Footer>
        <a href="https://lumber-jack.netlify.com">Play</a> +{" "}
        <a href="https://github.com/vnglst/lumber-jack">Source</a> [<b>2019</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Other experiments</h2>
      <p>
        Some experiments to play with the new React Hooks and micro animations
        in web UIs.
      </p>
      <Card.Footer>
        🕐 <a href="https://klok.netlify.com">Klok</a> +{" "}
        <a href="https://github.com/vnglst/klok">Source</a>
        <br />
        🖌 <a href="https://kids-draw.netlify.com/">Kids Draw</a> +{" "}
        <a href="https://github.com/vnglst/kids-draw">Source</a>
        <br />
        📖 <a href="https://write-only.netlify.com">Write Only</a> +{" "}
        <a href="https://github.com/vnglst/write-only">Source</a> [<b>2019</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Size of NPM</h2>
      <p>
        I thought it might be (mildly) interesting to keep track of how the NPM{" "}
        <code>node_modules</code> folder grows over time. This website keeps
        track of the size of the top 100 npm packages. It's been running for a
        while now and the results are... frightening?
      </p>
      <Card.Footer>
        <a href="https://size-of-npm.netlify.com/">View</a> +{" "}
        <a href="https://github.com/vnglst/size-of-npm/">Source</a> [<b>2018</b>
        ]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Protest Against</h2>
      <p>
        Feel like protesting against some minor injustice? This (somewhat silly)
        web app makes this as easy and fun as liking something on Facebook!
        Multiple users required, but you can also open more tabs (wait for the
        app to wake up).
      </p>
      <Card.Footer>
        <a href="https://protest-against.now.sh">Play</a> +{" "}
        <a href="https://github.com/vnglst/protest-against">Source</a> [
        <b>2018</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Peter and the Wolf</h2>
      <p>
        Progressive Web App for kids, based upon the classical piece "Peter and
        the Wolf" by Prokofiev. Turns out that making large mp3s available
        offline is harder than I thought.
      </p>
      <Card.Footer>
        <a href="https://peter-and-the-wolf.netlify.com">Play</a> +{" "}
        <a href="https://github.com/vnglst/peter-and-the-wolf">Source</a> [
        <b>2018</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Finding Nora</h2>
      <p>
        I created this fun little PWA for my daughter Nora to help her spell her
        name. She loved it, hope you do too!
      </p>
      <ul className="list-none mb-2">
        <li>
          🚀 <code>create-react-app</code> + TypeScript
        </li>
        <li>⛺ full offline support</li>
        <li>🎺 web audio for sounds</li>
      </ul>
      <Card.Footer>
        <a href="https://finding-nora.com">Play</a> +{" "}
        <a href="https://github.com/vnglst/finding-nora">Source</a> [<b>2018</b>
        ]
      </Card.Footer>
    </Card>

    <Card>
      <h2>
        Star Wars
        <br />
        or Star Trek?
      </h2>
      <p>
        Why not both? Using just CSS and a little bit of JavaScript I recreated
        these classic science fiction intro's.
      </p>
      <Card.Footer>
        <a href="http://star-trek.netlify.com">Star Trek</a> +{" "}
        <a href="https://github.com/vnglst/startrek ">Source</a>
        <br />
        <a href="http://starwars.koenvangilst.nl">Star Wars</a> +{" "}
        <a href="https://github.com/vnglst/starwars">Source</a> [<b>2017</b>]
      </Card.Footer>
    </Card>

    {/* <Card>
        <h2>Shortcut Trainer</h2>
        <p>
          Quickly learn the 10 most commonly used keyboard shortcuts for the
          translation CAT tool MemoQ. Weekend project using React.
        </p>
        <Card.Footer>
          <a href="http://shortcut-trainer.koenvangilst.nl/">Demo</a> +{" "}
          <a href="https://github.com/vnglst/shortcut-trainer">Source</a> [
          <b>2016</b>]
        </Card.Footer>
      </Card> */}

    {/* <Card>
        <h2>LaTeX Letters</h2>
        <p>
          Creating beautiful PDF letters using LaTeX in a Docker container on a
          server.
        </p>
        <Card.Footer>
          <a href="https://github.com/vnglst/latex-letter">Source code</a> [
          <b>2016</b>]
        </Card.Footer>
      </Card> */}

    <Card>
      <h2>Rush hour timelapse</h2>
      <p>
        A Twitter bot that creates daily timelapse videos of the traffic jams in
        The Netherlands. No longer active, but you can still see some of the old
        timelapses.
      </p>
      <Card.Footer>
        <a href="https://twitter.com/altijdfiles">@altijdfiles</a> +{" "}
        <a href="https://github.com/vnglst/spitsuur">Source</a> [<b>2016</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Term Search</h2>
      <p>
        A terminology search engine for translators. Currently only German-Dutch
        terms. Work in progress. [ No longer online ]
      </p>
      <p>Technologies: NodeJS, Express, MongoDB, Loopback, ReactJS.</p>
      <Card.Footer>
        <a href="https://github.com/TermSearch">Source</a> [<b>2016</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Help Terence!</h2>
      <p>
        A Twitter bot raising emoji money for his trip around the world. Fun
        little experiment with social media and Twitter bots. [ No longer active
        ]
      </p>
      <p>Technologies used: Express, MongoDB.</p>
      <Card.Footer>
        <a href="https://twitter.com/helpTerence"> @helpTerence </a> +{" "}
        <a href="https://github.com/vnglst/HelpTerence">Source</a> [<b>2016</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Word to Line Prices</h2>
      <p>
        A simple web app for translators that converts a price per word to a
        price per standard line (55 characters).
      </p>
      <Card.Footer>
        <a href="http://converter.koenvangilst.nl/">Visit the app</a> +{" "}
        <a href="https://github.com/vnglst/converter2">Source</a> [<b>2016</b>]
      </Card.Footer>
    </Card>

    <Card>
      <h2>Wikipedia edits by the Dutch government</h2>
      <p>
        Twitter bot inspired by{" "}
        <a href="https://twitter.com/congressedits">@congressedits</a> that
        monitors and Tweets any edits made to Wikipedia by the Dutch government.
      </p>
      <Card.Footer>
        <a href="https://twitter.com/OverheidEdits">@OverheidEdits</a> +{" "}
        <a href="https://github.com/vnglst/OverheidEdits">Source</a> [
        <b>2014</b>]
      </Card.Footer>
    </Card>

    {/* <Card>
      <h2>Starfield</h2>
      <p>
        I once wrote this program in assembly, but this time I wanted to do it
        in Javascript.
      </p>
      <Card.Footer>
        <a href="http://starfield.koenvangilst.nl/">Demo</a> [<b>2013</b>]
      </Card.Footer>
    </Card> */}

    {/* <Card>
      <h2>Dawkins' Trees</h2>
      <p>
        For this web app I've tried to recreate (in part) the program Richard
        Dawkins describes in his book The Blind Watchmaker.
      </p>
      <Card.Footer>
        <a href="http://dawkins.koenvangilst.nl/">Demo</a> [<b>2013</b>]
      </Card.Footer>
    </Card> */}
  </Layout>
);
