import { Sealevel } from './(charts)/Sealevel.server';
import { WeatherAnomaly } from './(charts)/WeatherAnomaly.server';

export const metadata = {
  title: 'Prognosis 2100',
  description:
    "Prognosis 2100 is a dashboard that allows users to explore the effects of climate change on the world's population."
};

export default async function Prognosis2100() {
  return (
    <div className="mb-10 grid w-full grid-cols-1 place-content-center gap-4 p-4 md:px-8 lg:grid-cols-2 2xl:grid-cols-3">
      <WeatherAnomaly type="temperature" look="dashboard" />
      <Sealevel />
    </div>
  );
}
