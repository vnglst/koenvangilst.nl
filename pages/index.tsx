import { FC } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Link from "next/link";

const Home: FC = () => {
  return (
    <Layout title="Home | Koen van Gilst" menu="home">
      <Card extraClasses="col-span-2">
        <h1>Hi, I'm Koen!</h1>
        <p>
          I'm a passionate & entrepreneurial JavaScript developer from the
          Netherlands who likes to push the web beyond it's limits. I specialize
          in modern frontend using React & Svelte and I also feel at home on the
          backend using Node/TypeScript.
        </p>
        <p>
          I'm interested in helping inspiring companies create innovative web
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
      </Card>

      <Card extraClasses="col-span-2">
        <h2>Skills</h2>
        <ul className="list-outside pl-4">
          <li>Platforms: Web, Node.js, Mobile (iOS)</li>
          <li>Languages: JavaScript, TypeScript, HTML5, CSS3</li>
          <li>
            Frameworks: React, React Native, Redux, Express, Next.js, Svelte,
            Sapper, jQuery
          </li>
          <li>
            Tooling & Testing: react-testing-library, Webpack, Lerna, Babel,
            Jest, Nock, Detox, Cypress, Git, Unix
          </li>
          <li>
            Knowledgeable: CI/CD, Testing, Monorepos, Single Page Apps,
            Accessibility, Server Side Rendering, Progressive Web Apps,
            Internationalization
          </li>
          <li>
            Services: Docker, Gitlab CI, MongoDB, Postgresql, BuddyBuild,
            Mixpanel, Google Tag Manager, Heroku, AWS, Google Cloud, Jira,
            Sentry, Bugsnag
          </li>
        </ul>
      </Card>

      <Card extraClasses="col-span-2">
        <h2>Notable Client Project</h2>
        <ul className="list-outside pl-4 leading-7">
          <li>
            For Stichting Dedicon I created a player for their audio books
            collections, it's designed specifically for users with visual
            impairments. The player also has a karaoke function that highlights
            the text currently being read, which helps children with dyslexia.{" "}
            <Link href="/dedicon">
              <a>Demo page (in Dutch)</a>
            </Link>
          </li>
          <li>
            For Tommy Hilfiger I worked as a fullstack JavaScript developer on
            their loyality app <i>MyTommy</i>. The app itself was build in React
            Native for both iPhone and Android, with a restful Node/Express API
            on the backend.{" "}
            <Link href="/hilfiger">
              <a>Demo page</a>
            </Link>
          </li>
          <li>
            The Dutch Chambre of Commerce (KVK) has a high traffic website
            (about 1.5 million visitors per month) with applications that help
            companies do business in The Netherlands. As a frontend engineer I'm
            part of the team building and deploying the new Online Registration
            web app, which makes it possible for Dutch entrepreneurs to register
            their business completely online.
          </li>
        </ul>
      </Card>

      <Card>
        <h2>Education</h2>
        <ul className="list-outside pl-4">
          <li>
            M.A. in Philosophy, Utrecht University (<i>cum laude</i>
            ).
          </li>
          <li>Minor in Computational Science, Utrecht University.</li>
          <li>Erasmus Student Exchange, Universität Regensburg (Germany).</li>
        </ul>
      </Card>

      <Card>
        <h2>References</h2>
        <p>References, code samples and a copy of my resume upon request.</p>
      </Card>
    </Layout>
  );
};

export default Home;
