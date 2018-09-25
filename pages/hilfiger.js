import Layout from '../components/layout'
import Creations from '../components/creations'

export default () => (
  <Layout title="Tommy Hilfiger | Koen van Gilst" menu="hilfiger">
    <Creations>
      <Creations.Item fullWidth>
        <h1>MyTommy Loyalty App</h1>
        <p>
          For Tommy Hilfiger I worked in an Agile Scrum team as a fullstack
          JavaScript developer on their loyality app <b>MyTommy</b>. I worked on
          new features and bug fixes, in particular on:
        </p>
        <ul>
          <li>Internationalization (backend and frontend, React-Intl)</li>
          <li>An Instagram feature, see screenshots below</li>
          <li>Mixpanel tracking</li>
          <li>Detox end-to-end tests in cooperation with QA</li>
          <li>Jest/Enzyme unit tests</li>
        </ul>
        <span className="links">
          <a href="https://itunes.apple.com/nl/app/mytommy/id1272118764?l=en&mt=8">
            MyTommy in the App Store
          </a>
        </span>
      </Creations.Item>

      <Creations.Item>
        <h1>Backend stack</h1>
        <p>Classical Node.js Express API. Gray box testing with Nock.</p>
        <ul>
          <li>Nock + Mocha for testing</li>
          <li>Bugsnag for error reporting</li>
          <li>Postgresql (Knex) database</li>
          <li>Passport</li>
        </ul>
      </Creations.Item>

      <Creations.Item>
        <h1>Frontend stack</h1>
        <p>Classical React + Redux frontend using:</p>
        <ul>
          <li>Redux Thunk, Persist etc.</li>
          <li>React Intl for localization</li>
          <li>Jest + Enyzme for testing</li>
          <li>Detox for end-to-end testing</li>
        </ul>
      </Creations.Item>

      <Creations.Item>
        <img src="/static/screenshots/mytommy1.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/mytommy2.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/mytommy3.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/mytommy4.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/mytommy5.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/mytommy6.png" />
      </Creations.Item>
    </Creations>
  </Layout>
)
