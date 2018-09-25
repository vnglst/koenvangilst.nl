import Creations from '../components/creations'
import Layout from '../components/layout'

export default () => (
  <Layout title="Dedicon | Koen van Gilst" menu="dedicon">
    <Creations>
      <Creations.Item fullWidth>
        <h1>
          Project Online Player <span>[OLP]</span>
        </h1>
        <p>
          Ontwikkeling van een online audiospeler in opdracht van Dedicon voor
          Stichting Passend Lezen.
        </p>
        <p>
          Met de OLP krijgt de gebruiker op verschillende manieren ondersteuning
          bij het lezen. De ondersteuning bestaat o.a. uit een markering van de
          zin/woorden van de door een menselijke stem voorgelezen tekst.
          Daarnaast kunnen voorleessnelheid, lettergrootte, kleuren etc. worden
          aangepast.
        </p>
        <p>
          De OLP is geschikt gemaakt voor gebruik met een schermlezer en kan met
          een brailleleesregel of andere screenreader worden gebruikt.
        </p>
      </Creations.Item>

      <Creations.Item>
        <h1>Voorbeeld audioboek</h1>
        <p>
          Hierbij opent de OLP het boek "Harry Potter en het vervloekte kind" in
          de audiomodus.
        </p>
        <span className="links">
          <a href="https://olp.netlify.com/?bookUrl=https://olp.netlify.com/harry-potter/ncc.html">
            Harry Potter en het vervloekte kind (fragment)
          </a>
        </span>
      </Creations.Item>

      <Creations.Item>
        <h1>Voorbeeld combiboek</h1>
        <p>
          Hierbij opent de OLP het boek "Geel Gras" in de combimodus, waarbij de
          tekst en het woord wordt gemarkeerd.
        </p>
        <span className="links">
          <a href="https://olp.netlify.com/?bookUrl=https://olp.netlify.com/geel-gras/ncc.html">
            Geel Gras (fragment)
          </a>
        </span>
      </Creations.Item>

      <Creations.Item>
        <img src="/static/screenshots/dedicon1.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/dedicon2.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/dedicon3.png" />
      </Creations.Item>
      <Creations.Item>
        <img src="/static/screenshots/dedicon5.png" />
      </Creations.Item>
      <Creations.Item fullWidth>
        <img src="/static/screenshots/dedicon6.png" />
      </Creations.Item>
      <Creations.Item fullWidth>
        <img src="/static/screenshots/dedicon7.png" />
      </Creations.Item>
    </Creations>
  </Layout>
)
