'use client';

import dynamic from 'next/dynamic';

import { Checkbox } from 'components/Checkbox';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

import { LoadingMap } from './LoadingMap';
import { useMapSettings } from './useMapSettings';

const ArcGISMap = dynamic(() => import('./ArcGIS'), {
  ssr: false,
  loading: LoadingMap
});

export default function DeforestationMap() {
  const settings = useMapSettings();

  return (
    <>
      <div className="z-20 w-fit rounded-md bg-white bg-opacity-80 p-8 backdrop-saturate-50 dark:bg-black dark:bg-opacity-80">
        <Heading>Deforestation Check</Heading>
        <Prose>
          Keep track of deforestation in your area. Get a detailed view of
          changes in forest cover over time.
        </Prose>
        <div className="mt-8 flex flex-wrap gap-6">
          <Checkbox
            color="pink"
            onChange={settings.toggleTreeLossLayer}
            checked={settings.showTreeLoss}
          >
            Tree loss
          </Checkbox>
          <Checkbox
            color="blue"
            onChange={settings.toggleTreeGainLayer}
            checked={settings.showTreeGain}
          >
            Tree gain
          </Checkbox>
        </div>
      </div>
      <ArcGISMap
        initial={settings.initial.current}
        showTreeLoss={settings.showTreeLoss}
        showTreeGain={settings.showTreeGain}
        handleCenterPointChange={settings.handleCenterPointChange}
      />
    </>
  );
}
