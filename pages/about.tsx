import Container from 'components/Container';

export default function About() {
  return (
    <Container title="About – Koen van Gilst" type="article">
      <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          About Me
        </h1>
        <article className="mb-8 prose leading-6 text-gray-600 dark:text-gray-400">
          <p>
            {`Hi, I'm Koen! I'm a passionate & entrepreneurial JavaScript
            developer from the Netherlands who likes to push the web beyond it's
            limits. I specialize in modern frontend using React & Svelte and I
            also feel at home on the backend using Node/TypeScript.`}
          </p>
          <p>
            {`I'm interested in helping inspiring companies create innovative web
            apps that users love.`}
          </p>
        </article>
        <article className="mb-8 prose leading-6 text-gray-600 dark:text-gray-400">
          <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            Skills
          </h2>
          <ul>
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
        </article>
        <article className="mb-8 prose leading-6 text-gray-600 dark:text-gray-400">
          <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            Education
          </h2>
          <ul>
            <li>
              M.A. in Philosophy, Utrecht University (<i>cum laude</i>).
            </li>
            <li>Minor in Computational Science, Utrecht University.</li>
            <li>Erasmus Student Exchange, Universität Regensburg (Germany).</li>
          </ul>
        </article>
        <article className="mb-8 prose leading-6 text-gray-600 dark:text-gray-400">
          <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
            References
          </h2>
          <p>References, code samples and a copy of my resume upon request.</p>
        </article>
      </article>
    </Container>
  );
}
