'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Checkbox } from 'components/Checkbox';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { Prose } from 'components/Prose';

import { LoadingMap } from './LoadingMap';
import { useMapSettings } from './useMapSettings';

const ArcGISMap = dynamic(() => import('./ArcGIS'), {
  ssr: false,
  loading: LoadingMap
});

export default function DeforestationMap() {
  const settings = useMapSettings();
  const [isBoxVisible, setBoxVisible] = useState(true);

  return (
    <div className="flex h-full w-full flex-wrap gap-4">
      <ArcGISMap
        initial={settings.initial}
        showTreeLoss={settings.showTreeLoss}
        showTreeGain={settings.showTreeGain}
        handleCenterPointChange={settings.handleCenterPointChange}
      />
      {isBoxVisible && (
        <div className="relative h-fit w-fit rounded-md bg-white bg-opacity-80 p-8 backdrop-saturate-50 dark:bg-black dark:bg-opacity-80">
          <button
            onClick={() => setBoxVisible(false)}
            className="absolute right-0 top-0 p-4"
          >
            <Icon icon="x" className="h-6 w-6 text-white" />
          </button>
          <Heading>Deforestation Check</Heading>
          <Prose>
            Keep track of deforestation in your area. Get a detailed view of
            changes in forest cover over time.
            <br />
            <ul>
              <li>
                <Link href="./deforestation?latitude=51.96778310929577&longitude=5.15488204138948&zoom=17&treeloss=on&treegain=on&update=on">
                  Place I was born
                </Link>
              </li>
              <li>
                <Link href="./deforestation?latitude=50.172148105701275&longitude=10.732986184445075&zoom=17&treeloss=on&treegain=on&update=on">
                  Altenstein
                </Link>
              </li>
              <li>
                <Link href="./deforestation?latitude=52.1280165644353&longitude=5.186416729873873&zoom=17&treeloss=on&treegain=on&update=on">
                  Where I live
                </Link>
              </li>
            </ul>
          </Prose>
        </div>
      )}
      <div className="ml-auto mt-auto flex h-fit w-fit flex-col flex-wrap gap-4 rounded-md bg-white bg-opacity-80 p-4 text-sm backdrop-saturate-50 dark:bg-black dark:bg-opacity-80">
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
  );
}
