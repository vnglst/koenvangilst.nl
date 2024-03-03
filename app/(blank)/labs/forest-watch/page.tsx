import { Suspense } from 'react';

import { CONFIG } from './config';
import DeforestationMap from './ForestMap';
import { getBaseLayers } from './wayback-layers';

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
    yearsBack: parseInt(CONFIG.yearsBack, 10)
  });

  return (
    <div className="flex h-full w-full bg-slate-200 px-4 pb-6 pt-20 text-black md:px-8 md:pt-28 dark:bg-slate-800 dark:text-white">
      <Suspense>
        <DeforestationMap baseLayers={baseLayers} />
      </Suspense>
    </div>
  );
}
