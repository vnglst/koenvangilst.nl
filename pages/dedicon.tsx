import { FC } from "react";
import Card from "../components/Card";
import Layout from "../components/Layout";

const Dedicon: FC = () => {
  return (
    <Layout title="Dedicon | Koen van Gilst" menu="home">
      <Card extraClasses="col-span-2">
        <h1>Dedicon</h1>
        <p>
          Ontwikkeling van een online audiospeler in opdracht van Dedicon voor
          Stichting Passend Lezen.
        </p>
        <p>
          Met de Online Player (OLP) krijgt de gebruiker op verschillende
          manieren ondersteuning bij het lezen. De ondersteuning bestaat o.a.
          uit een markering van de zin/woorden van de door een menselijke stem
          voorgelezen tekst. Daarnaast kunnen voorleessnelheid, lettergrootte,
          kleuren etc. worden aangepast.
        </p>
        <p>
          De OLP is geschikt gemaakt voor gebruik met een schermlezer en kan met
          een brailleleesregel of andere screenreader worden gebruikt.
        </p>
      </Card>

      <Card>
        <h2>Voorbeeld audioboek</h2>
        <p>
          Hierbij opent de OLP het boek "Harry Potter en het vervloekte kind" in
          de audiomodus.
        </p>
        <a href="https://olp.netlify.app/?bookUrl=https://olp.netlify.app/harry-potter/ncc.html">
          Harry Potter en het vervloekte kind (fragment)
        </a>
      </Card>

      <Card>
        <h2>Voorbeeld combiboek</h2>
        <p>
          Hierbij opent de OLP het boek "Geel Gras" in de combimodus, waarbij de
          tekst en het woord wordt gemarkeerd.
        </p>
        <a href="https://olp.netlify.app/?bookUrl=https://olp.netlify.app/geel-gras/ncc.html">
          Geel Gras (fragment)
        </a>
      </Card>

      <Card>
        <img src="/static/screenshots/dedicon1.png" />
      </Card>
      <Card>
        <img src="/static/screenshots/dedicon2.png" />
      </Card>
      <Card>
        <img src="/static/screenshots/dedicon3.png" />
      </Card>
      <Card>
        <img src="/static/screenshots/dedicon5.png" />
      </Card>
      <Card extraClasses="col-span-2">
        <img src="/static/screenshots/dedicon6.png" />
      </Card>
      <Card extraClasses="col-span-2">
        <img src="/static/screenshots/dedicon7.png" />
      </Card>
    </Layout>
  );
};

export default Dedicon;
