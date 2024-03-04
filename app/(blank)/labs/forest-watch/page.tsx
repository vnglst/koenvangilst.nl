import { Suspense } from 'react';

import { CONFIG } from './config';
import ForestWatch from './ForestWatch';
import { getBaseLayers } from './getBaseLayers';

import '@arcgis/core/assets/esri/themes/dark/main.css';
import './styles.css';

export const metadata = {
  title: 'Forest Watch',
  description:
    'Keep track of forests in your area. Get a detailed view of changes in forest cover over time.'
};

export default async function Deforestation() {
  const baseLayers = await getBaseLayers({
    url: CONFIG.url,
    yearsBack: parseInt(CONFIG.yearsBack)
  });

  return (
    <div className="flex h-full w-full bg-slate-200 px-4 pb-6 pt-20 text-black md:px-8 md:pt-28 dark:bg-slate-800 dark:text-white">
      <Suspense>
        <ForestWatch baseLayers={baseLayers} />
      </Suspense>
    </div>
  );
}
