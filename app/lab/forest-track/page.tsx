import { Suspense } from 'react';

import { CONFIG } from './config';
import { ForestTrack } from './ForestTrack';
import { getBaseLayers } from './getBaseLayers';

import '@arcgis/core/assets/esri/themes/dark/main.css';
import './styles.css';

export const metadata = {
  title: 'Forest Track',
  description: 'Keep track of forests in your area. Get a detailed view of changes in forest cover over time.'
};

export default async function Page() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const baseLayers = await getBaseLayers({
    url: CONFIG.url,
    yearsBack: parseInt(CONFIG.yearsBack)
  });

  return (
    <div className="flex h-screen w-full bg-slate-200 px-4 pt-20 pb-6 text-black md:px-8 md:pt-24 dark:bg-slate-800 dark:text-white">
      <Suspense>
        {isDevelopment ? (
          <ForestTrack baseLayers={baseLayers} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <p className="max-w-md text-center">
              This feature is currently not available. Check back later when it's ready for production.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
