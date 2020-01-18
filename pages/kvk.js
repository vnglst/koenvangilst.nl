import Card from "../components/Card";
import Layout from "../components/Layout";

export default () => (
  <Layout title="Kamer van Koophandel | Koen van Gilst" menu="home">
    <Card extraClasses="col-span-2">
      <h1>Online Registreren</h1>
      <p>
        De Kamer van Koophandel heb ik als frontendontwikkelaar geholpen bij de
        ontwikkeling van de applicatie waarmee startende ondernemers (ZZP-ers)
        hun nieuwe onderneming online kunnen inschrijven. Met online registreren
        sluit KVK aan op de brede maatschappelijke behoefte om transacties (met
        overheden) online af te handelen.
      </p>

      <p>
        Deze applicatie is eind 2019 landelijk live gegaan en wordt jaarlijks
        door meer dan 150.000 startende ZZP-ers worden gebruikt. Gebruikers
        beoordelen deze applicatie uiterst positief (hoogste tevredenheidsscore
        van de KVK).
      </p>
      <p>
        Sinds juni 2020 is het voor gebruikers ook mogelijk om de registratie
        helemaal online af te ronden. Hiervoor wordt gebruikt gemaakt van een
        speciale technologie waarmee ook de legitimatie volledig digitaal wordt
        uitgevoerd. Een bezoek aan een van de KVK-kantoren is daardoor voor het
        registreren van een onderneming niet meer vereist.
      </p>
    </Card>

    <Card extraClasses="col-span-2">
      <h2>Inloggen</h2>
      <img src="/static/kvk-inloggen.gif" />
    </Card>

    <Card extraClasses="col-span-2">
      <h2>Start</h2>
      <img src="/static/beheer.gif" />
    </Card>

    <Card extraClasses="col-span-2">
      <h2>Samenstellen</h2>
      <img src="/static/steps.gif" />
    </Card>
  </Layout>
);
