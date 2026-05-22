import { createFileRoute } from '@tanstack/react-router';
import { BackButton } from '#/components/ui/BackButton';
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
      }
    ]
  }),
  component: Prognosis2100
});

function PrognosisToggle() {
  const { showPrognosis, togglePrognosis } = usePrognosisStore();
  return (
    <Toggle
      label="Show prognosis"
      onChange={togglePrognosis}
      checked={showPrognosis}
    />
  );
}

function Prognosis2100() {
  return (
    <div className="relative min-h-screen">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-slate-50 p-4 shadow-sm md:px-8 dark:bg-slate-950">
        <BackButton
          fallbackHref="/lab"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-opacity hover:opacity-60 dark:text-gray-300"
        >
          Back
        </BackButton>
        <Heading
          level={1}
          className="nimbus absolute left-1/2 -translate-x-1/2 text-lg tracking-wide text-gray-900 uppercase md:text-2xl dark:text-gray-100"
        >
          Prognosis 2100
        </Heading>
        <PrognosisToggle />
      </div>
      <div className="mb-10 grid min-h-screen w-full grid-cols-1 gap-4 p-4 md:px-8 lg:grid-cols-2 2xl:grid-cols-3">
        <div className="prose dark:prose-invert my-auto p-2 md:py-6 md:pr-8">
          <p>
            The year 2100 seems far away but it is not unlikely that my children will still be alive then. What will the
            Netherlands look like then? Will we have a warmer more subtropical climate? Will our dykes be high enough? And
            will our economy be CO2 neutral?
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
        </div>
        <WeatherAnomaly type="temperature" look="dashboard" />
        <Sealevel />
        <Co2Level />
      </div>
    </div>
  );
}
