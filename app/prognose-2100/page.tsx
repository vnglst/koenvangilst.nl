import { Anomaly } from 'app/blog/rising-temperatures/charts/Anomaly.server';

import { Sealevel } from './(charts)/Sealevel.server';

export const metadata = {
  title: 'Prognose 2100',
  description:
    "Prognose 2100 is a dashboard that allows users to explore the effects of climate change on the world's population."
};

export default async function Prognose2100() {
  return (
    <div className="mb-10 grid w-full grid-cols-1 place-content-center gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      <Anomaly type="temperature" look="dashboard" />
      <Anomaly type="sunshine" look="dashboard" />
      <Anomaly type="rain" look="dashboard" />
      <Sealevel />
    </div>
  );
}
