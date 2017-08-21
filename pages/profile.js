import Layout from '../components/layout'

export default () =>
  <Layout title='Profile | Koen van Gilst' menu='profile' >
    <section className='creations'>
      <div className='wrapper'>
        <div className='project'>
          <h1>Profile</h1>
          <p>
            Entrepreneurial and enthousiastic JavaScript developer based in
            Utrecht (NL). Specializes in Node and modern front end using React
            and Webpack. Always looking for new challenging freelance work and
            particularly interested in creating innovative web apps with the
            latest technologies.
          </p>
          <p>
            You can find me on <a href='https://github.com/vnglst'>Github</a>, <a href='http://nl.linkedin.com/in/vangilst/'>LinkedIn</a> and <a href='http://www.twitter.com/vnglst'>Twitter</a> or send me an{' '}
            <a href='&#x6d;&#x61;&#x69;&#108;&#116;&#111;&#x3a;&#107;&#x6f;&#x65;&#x6e;&#x40;&#x6b;&#x6f;&#x65;&#x6e;&#x76;&#97;&#x6e;&#x67;&#x69;&#108;&#x73;&#116;&#x2e;&#x6e;&#x6c;'>
              email
            </a>.
          </p>

        </div>
        <div className='project project--profile' />

        <div className='project project--double'>
          <h1>Skills</h1>
          <ul>
            <li>
              <b>Platforms:</b> Node.js, Browser (web)
            </li>
            <li>
              <b>Languages:</b> JavaScript (ES2015/16/17), HTML5, CSS3
            </li>
            <li>
              <b>Frameworks:</b> Express, Next.js, React, Redux, jQuery
            </li>
            <li>
              <b>Tooling & Testing:</b> Chai, Mocha, Tape, Webpack, Babel, Jest,
              Flow
            </li>
            <li>
              <b>General:</b> MongoDB, JIRA, Git, Bash, Unix, PWAs, Web
              Accessibility
            </li>
          </ul>
        </div>

        <div className='project' style={{ height: '170px' }}>
          <h1>Education</h1>
          <ul>
            <li>
              <b>M.A. in Philosophy</b>, Utrecht University (<i>cum laude</i>).
            </li>
            <li>
              <b>Minor in Computational Science</b>, Utrecht University.
            </li>
            <li>
              <b>Erasmus Student Exchange</b>, Universität Regensburg (Germany).
            </li>
          </ul>
        </div>

        <div className='project' style={{ height: '170px' }}>
          <h1>References</h1>
          <p>References, code samples and a copy of my resume upon request.</p>
        </div>
      </div>
    </section>
  </Layout>
