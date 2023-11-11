export const metadata = {
  title: 'About',
  openGraph: {
    type: 'article'
  },
  alternates: {
    canonical: 'about'
  }
};

export default function About() {
  return (
    <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        About Me
      </h1>
      <article className="mb-4 prose leading-6 text-gray-600 dark:text-gray-400">
        <p>
          Hello! I'm Koen, an enthusiastic and entrepreneurial JavaScript
          developer from the Netherlands who likes to push the web beyond its
          limits. My expertise lies in crafting cutting-edge frontend
          experiences using React, Angular or Svelte, while also navigating
          comfortably through backend landscapes with Node and TypeScript. I'm
          interested in helping inspiring companies create innovative web apps
          that users love.
        </p>
        <p>
          If you want to discuss an opportunity with me, feel free to{' '}
          <a className="text-primary" href="/15">
            reach out
          </a>
          . Sometimes I'm available for hire for advice, mentoring or
          consulting.
        </p>
        <p>
          Recently, I embarked on a new journey with Rabobank, stepping into the
          role of a lead frontend developer. In this position, my aim is to
          guide others through Rabobank's sometimes complex environment,
          fostering a community where developers can effortlessly seek
          assistance, engage in code reviews, exchange code snippets, and
          collectively grow. And of course, I'll continue coding – an aspect of
          my career that I always cherish and wouldn't dream of giving up!
        </p>
      </article>
      <article className="mb-8 prose leading-6 text-gray-600 dark:text-gray-400">
        <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
          Skills
        </h2>
        <ul>
          <li>Platforms: Web, Node.js, Mobile (iOS)</li>
          <li>
            Languages: JavaScript, TypeScript, Python, Elixir, HTML5, CSS3
          </li>
          <li>
            Frameworks: React, React Native, Redux, Express, Next.js, Angular,
            Svelte, Sapper, jQuery
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
  );
}
