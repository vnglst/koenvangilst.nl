import Layout from '../components/layout'

export default () => (
  <Layout title="Profile | Koen van Gilst" menu="profile">
    <section className="creations">
      <div className="wrapper">
        <div className="project">
          <h1>Profile</h1>
          <p>
            Passionate JavaScript developer based in Utrecht, Netherlands. I
            specialize in Node and modern frontend using React. I'm always
            looking for new challenging freelance work and I'm particularly
            interested in creating innovative web apps for <b>inspiring</b>{' '}
            companies.
          </p>
          <p>
            You can find me on <a href="https://github.com/vnglst">Github</a>,{' '}
            <a href="http://nl.linkedin.com/in/vangilst/">LinkedIn</a> and{' '}
            <a href="http://www.twitter.com/vnglst">Twitter</a> or send me an{' '}
            <a href="&#x6d;&#x61;&#x69;&#108;&#116;&#111;&#x3a;&#107;&#x6f;&#x65;&#x6e;&#x40;&#x6b;&#x6f;&#x65;&#x6e;&#x76;&#97;&#x6e;&#x67;&#x69;&#108;&#x73;&#116;&#x2e;&#x6e;&#x6c;">
              email
            </a>
            .
          </p>
        </div>
        <div className="project project--profile" />

        <div className="project project--double">
          <h1>Skills</h1>
          <ul>
            <li>
              <b>Platforms:</b> Web, Node.js, Mobile (iOS)
            </li>
            <li>
              <b>Languages:</b> JavaScript, TypeScript, HTML5, CSS3
            </li>
            <li>
              <b>Frameworks:</b> React, React Native, Redux, Express, Next.js,
              jQuery, Redux, jQuery
            </li>
            <li>
              <b>Tooling & Testing:</b> Webpack, Babel, Jest, Chai, Mocha,
              Detox, Nock, Flow
            </li>
            <li>
              <b>Knowledgeable:</b> Accessibility, Progressive Web Apps,
              Internationalization, SEO
            </li>
            <li>
              <b>Services:</b> Postgresql, MongoDB, Contentful, PhraseApp,
              Bugsnag, BuddyBuild, Mixpanel, Heroku, AWS, Google Cloud, Jira
            </li>
          </ul>
        </div>

        <div className="project" style={{ height: '170px' }}>
          <h1>Education</h1>
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
        </div>

        <div className="project" style={{ height: '170px' }}>
          <h1>References</h1>
          <p>References, code samples and a copy of my resume upon request.</p>
        </div>
      </div>
    </section>
  </Layout>
)
