import { Helmet } from 'react-helmet-async';

import { Co2Level } from '../../../app/lab/prognosis-2100/(charts)/Co2Level';
import { Sealevel } from '../../../app/lab/prognosis-2100/(charts)/Sealevel.server';
import { WeatherAnomaly } from '../../../app/lab/prognosis-2100/(charts)/WeatherAnomaly.server';

export function Prognosis2100Page() {
  return (
    <>
      <Helmet>
        <title>Prognosis 2100 | Koen van Gilst</title>
        <meta
          name="description"
          content="Prognosis 2100 is a dashboard that allows users to explore the effects of climate change on the world's population."
        />
      </Helmet>
      <div className="mb-10 grid min-h-screen w-full grid-cols-1 gap-4 p-4 md:px-8 lg:grid-cols-2 2xl:grid-cols-3">
        <div className="prose dark:prose-invert my-auto p-2 md:py-6 md:pr-8">
          <p>
            The year 2100 seems far away but it is not unlikely that my children will still be alive then. What will
            the Netherlands look like then? Will we have a warmer more subtropical climate? Will our dykes be high
            enough? And will our economy be CO2 neutral?
          </p>
          <p>
            With this website, I want to answer these questions at a glance. So you can immediately see where we are
            now and what the prognosis is for the Netherlands in 2100. The graphs are based on facts and scientific
            models from well-known institutes. Where the data is as up to date as possible and the models correspond to
            the latest insights.
          </p>
          <p>
            I hope that, as octogenarians, my children will be able to look back on our period as the tipping point
            when we started to tackle climate change seriously.
          </p>
        </div>
        <WeatherAnomaly type="temperature" look="dashboard" />
        <Sealevel />
        <Co2Level />
      </div>
    </>
  );
}
