import Container from 'components/Container';

export default function About() {
  return (
    <Container title="About – Koen van Gilst" type="article">
      <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          About Me
        </h1>
        <article className="mb-4 prose leading-6 text-gray-600 dark:text-gray-400">
          <p>
            {`Hi, I'm Koen! I'm a passionate and entrepreneurial JavaScript developer from 
            the Netherlands who likes to push the web beyond its limits. I specialize in 
            modern frontend using React and Svelte, and I also feel at home on the backend 
            using Node/TypeScript. I'm interested in helping inspiring companies create 
            innovative web apps that users love.`}
          </p>
          <p>
            If you want to discuss an opportunity with me, feel free to{' '}
            <a className="text-primary" href="/15">
              reach out
            </a>
            . Sometimes I&apos;m available for hire for advice, mentoring or
            consulting.
          </p>
          <p>
            {`This year, I joined Rabobank as a lead frontend developer. In my new role, I'll be helping others find their way around the complex environment of Rabobank. I hope to create a sense of community so that developers can more easily ask colleagues for help, conduct code reviews, share code snippets, and generally learn from each other. Of course, I will still be coding myself as well. I wouldn't want to miss that!`}
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
      </article>
    </Container>
  );
}
