import { BackToLab } from '#/components/layout/BackToLab';
import { createFileRoute } from '@tanstack/react-router';
import { Container } from '#/components/layout/Container';
import { Toolbar } from '#/components/layout/Toolbar';
import { Prose } from '#/components/content/Prose';
import { Heading } from '#/components/content/Heading';
import { Toggle } from '#/components/forms/Toggle';
import { usePrognosisStore } from './_store/prognosis';
import { Co2Level } from './_charts/Co2Level';
import { Sealevel } from './_charts/Sealevel';
import { WeatherAnomaly } from './_charts/WeatherAnomaly';

export const Route = createFileRoute('/lab/prognosis-2100/')({
  head: () => ({
    meta: [
      { title: 'Prognosis 2100 | Koen van Gilst' },
      {
        name: 'description',
        content:
          "Prognosis 2100 is a dashboard that allows users to explore the effects of climate change on the world's population."
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: 'https://koenvangilst.nl/lab/prognosis-2100' },
      { property: 'og:title', content: 'Prognosis 2100 | Koen van Gilst' },
      {
        property: 'og:description',
        content: 'Explore the effects of climate change with interactive data visualizations.'
      },
      { name: 'twitter:card', content: 'summary_large_image' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/lab/prognosis-2100' }]
  }),
  component: Prognosis2100
});

function PrognosisToggle() {
  const { showPrognosis, togglePrognosis } = usePrognosisStore();
  return <Toggle label="Show prognosis" onChange={togglePrognosis} checked={showPrognosis} />;
}

function Prognosis2100() {
  return (
    <Container layout="dashboard">
      <BackToLab />
      <Toolbar className="mb-8">
        <Heading level={1} className="mb-0!">
          Prognosis 2100
        </Heading>
        <PrognosisToggle />
      </Toolbar>
      <div className="prognosis-grid">
        <Prose as="div" className="dashboard-introduction">
          <p>
            The year 2100 seems far away but it is not unlikely that my children will still be alive then. What will the
            Netherlands look like then? Will we have a warmer more subtropical climate? Will our dykes be high enough?
            And will our economy be CO2 neutral?
          </p>
          <p>
            With this website, I want to answer these questions at a glance. So you can immediately see where we are now
            and what the prognosis is for the Netherlands in 2100. The graphs are based on facts and scientific models
            from well-known institutes. Where the data is as up to date as possible and the models correspond to the
            latest insights.
          </p>
          <p>
            I hope that, as octogenarians, my children will be able to look back on our period as the tipping point when
            we started to tackle climate change seriously.
          </p>
        </Prose>
        <WeatherAnomaly type="temperature" look="dashboard" />
        <Sealevel />
        <Co2Level />
      </div>
    </Container>
  );
}
