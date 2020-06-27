import Layout from "../components/layout";
import Card from "../components/Card";

export default () => (
  <Layout title="Tommy Hilfiger | Koen van Gilst" menu="hilfiger">
    <Card extraClasses="col-span-2">
      <h1>MyTommy</h1>
      <p>
        For Tommy Hilfiger I worked in an Agile Scrum team as a fullstack
        JavaScript developer on their loyality app <b>MyTommy</b>. I worked on
        new features and bug fixes, in particular:
      </p>
      <ul className="list-outside pl-4 mb-3">
        <li>Internationalization (backend and frontend, React-Intl)</li>
        <li>An Instagram feature, see screenshots below</li>
        <li>Mixpanel tracking</li>
        <li>Detox end-to-end tests in cooperation with QA</li>
        <li>Jest/Enzyme unit tests</li>
      </ul>
      <Card.Footer>
        <a href="https://itunes.apple.com/nl/app/mytommy/id1272118764?l=en&mt=8">
          MyTommy in the App Store
        </a>
      </Card.Footer>
    </Card>

    <Card>
      <h1>Backend</h1>
      <p>Node.js Express API:</p>
      <ul className="list-outside pl-4">
        <li>Nock for gray box testing</li>
        <li>Bugsnag for error reporting</li>
        <li>Postgresql (Knex) database</li>
        <li>Passport</li>
      </ul>
    </Card>

    <Card>
      <h1>Frontend</h1>
      <p>React + Redux:</p>
      <ul className="list-outside pl-4">
        <li>Redux Thunk, Persist etc.</li>
        <li>React Intl for localization</li>
        <li>Jest + Enyzme for unit tests</li>
        <li>Detox for end-to-end tests</li>
      </ul>
    </Card>

    <Card>
      <img src="/static/screenshots/mytommy1.png" />
    </Card>
    <Card>
      <img src="/static/screenshots/mytommy2.png" />
    </Card>
    <Card>
      <img src="/static/screenshots/mytommy3.png" />
    </Card>
    <Card>
      <img src="/static/screenshots/mytommy4.png" />
    </Card>
    <Card>
      <img src="/static/screenshots/mytommy5.png" />
    </Card>
    <Card>
      <img src="/static/screenshots/mytommy6.png" />
    </Card>
  </Layout>
);
