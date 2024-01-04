import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

export default function Page() {
  return (
    <Container left>
      <Prose>
        <Heading>Over</Heading>
        <p>
          Het jaar 2100 lijkt ver weg maar het is niet onwaarschijnlijk dat mijn
          kinderen dan nog leven. Hoe ziet Nederland er dan uit? Hebben we dan
          een warmer, subtropisch klimaat? Zijn onze dijken hoog genoeg? En
          draait onze economie dan helemaal CO2-neutraal?
        </p>
        <p>
          Met deze website wil ik in een oogopslag een antwoord geven op deze
          vragen. Je kunt meteen zien waar we nu staan en wat de prognose is
          voor Nederland in 2100. De grafieken zijn altijd gebaseerd op feiten
          en wetenschappelijke modellen van bekende instituten. Waarbij de data
          zoveel mogelijk up to date is en de modellen corresponderen met de
          nieuwste inzichten.
        </p>
        <p>
          Ik hoop dat mijn kinderen als tachtigjarigen kunnen terugkijken op
          onze periode als het kantelpunt waarop we de klimaatverandering
          serieus begonnen aan te pakken.
        </p>
        <p>
          Deze website is gemaakt door{' '}
          <Link
            href="https://koenvangilst.nl/about"
            className="underline hover:text-slate-700 dark:hover:text-slate-200"
          >
            Koen van Gilst
          </Link>
          . De broncode is open source en te vinden op{' '}
          <a href="https://github.com/vnglst/koenvangilst.nl" target="_blank">
            Github
          </a>
          . Voor de realisatie van deze website is gebruik gemaakt van React,
          TailwindCSS en de visualisatielibrary Apache ECharts.
        </p>
      </Prose>
    </Container>
  );
}
