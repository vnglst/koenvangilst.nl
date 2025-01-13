import { Suspense } from 'react';

import { Container } from 'components/Container';

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
  const baseLayers = await getBaseLayers({
    url: CONFIG.url,
    yearsBack: parseInt(CONFIG.yearsBack)
  });

  return (
    <Container footer={false} useLayout={false}>
      <div className="flex h-full h-screen w-full bg-slate-200 px-4 pb-6 pt-20 text-black dark:bg-slate-800 dark:text-white md:px-8 md:pt-28">
        <Suspense>
          <ForestTrack baseLayers={baseLayers} />
        </Suspense>
      </div>
    </Container>
  );
}
