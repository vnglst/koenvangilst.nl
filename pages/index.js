import Layout from "../components/layout";
import Creations from "../components/creations";
import Link from "next/link";

export default () => (
  <Layout title="Profile | Koen van Gilst" menu="home">
    <Creations>
      <Creations.Item>
        <h1>Koen van Gilst</h1>
        <p>
          Passionate & entrepreneurial JavaScript developer based in Utrecht.
          M.A. in Philosophy (cum laude) and a minor in Computational Science.
          Specializes in modern frontend (React) and backend (Node). Interested
          in working with <b>inspiring</b> companies that create innovative web
          apps that users love.
        </p>
        <p>
          You can find me on <a href="https://github.com/vnglst">Github</a>,{" "}
          <a href="http://nl.linkedin.com/in/vangilst/">LinkedIn</a> and{" "}
          <a href="http://www.twitter.com/vnglst">Twitter</a> or send me an{" "}
          <a href="&#x6d;&#x61;&#x69;&#108;&#116;&#111;&#x3a;&#107;&#x6f;&#x65;&#x6e;&#x40;&#x6b;&#x6f;&#x65;&#x6e;&#x76;&#97;&#x6e;&#x67;&#x69;&#108;&#x73;&#116;&#x2e;&#x6e;&#x6c;">
            email
          </a>
          .
        </p>
      </Creations.Item>

      <Creations.Item>
        <img src="/static/img/koen-photo.jpg" alt="Koen van Gilst" />
      </Creations.Item>

      <Creations.Item fullWidth>
        <h2>Notable Client Project</h2>
        <ul>
          <li>
            For <b>Stichting Dedicon</b> I created a player for their audio
            books collections, it's designed specifically for users with visual
            impairments. The player also has a karaoke function that highlights
            the text currently being read, which helps children with dyslexia.{" "}
            <Link href="/dedicon">
              <a>Demo page (in Dutch)</a>
            </Link>
          </li>
          <li>
            For <b>Tommy Hilfiger</b> I worked as a fullstack JavaScript
            developer on their loyality app <i>MyTommy</i>. The app itself was
            build in React Native for both iPhone and Android, with a restful
            Node/Express API on the backend.{" "}
            <Link href="/hilfiger">
              <a>Demo page (in Dutch)</a>
            </Link>
          </li>
          <li>
            The <b>Dutch Chambre of Commerce (KVK)</b> has a high traffic
            website (about 1.5 million visitors per month) with applications
            that help companies do business in The Netherlands. As a frontend
            engineer I'm part of the team building and deploying the new Online
            Registration web app, which makes it easier for Dutch entrepreneurs
            to register their business online.
          </li>
        </ul>
      </Creations.Item>

      <Creations.Item fullWidth>
        <h2>Skills</h2>
        <ul>
          <li>
            <b>Platforms:</b> Web, Node.js, Mobile (iOS)
          </li>
          <li>
            <b>Languages:</b> JavaScript, TypeScript, HTML5, CSS3
          </li>
          <li>
            <b>Frameworks:</b> React, React Native, Redux, Express, Next.js,
            Svelte, Sapper, jQuery
          </li>
          <li>
            <b>Tooling & Testing:</b> react-testing-library, Webpack, Lerna,
            Babel, Jest, Nock, Detox, Cypress, Git, Unix
          </li>
          <li>
            <b>Knowledgeable:</b> CI/CD, Testing, Monorepos, Single Page Apps,
            Accessibility, Server Side Rendering, Progressive Web Apps,
            Internationalization
          </li>
          <li>
            <b>Services:</b> Docker, Gitlab CI, MongoDB, Postgresql, BuddyBuild,
            Mixpanel, Google Tag Manager, Heroku, AWS, Google Cloud, Jira,
            Sentry, Bugsnag
          </li>
        </ul>
      </Creations.Item>

      <Creations.Item>
        <h2>Education</h2>
        <ul>
          <li>
            <b>M.A. in Philosophy</b>, Utrecht University (<i>cum laude</i>
            ).
          </li>
          <li>
            <b>Minor in Computational Science</b>, Utrecht University.
          </li>
          <li>
            <b>Erasmus Student Exchange</b>, Universität Regensburg (Germany).
          </li>
        </ul>
      </Creations.Item>

      <Creations.Item>
        <h2>References</h2>
        <p>References, code samples and a copy of my resume upon request.</p>
      </Creations.Item>
    </Creations>
  </Layout>
);
