'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Checkbox } from 'components/Checkbox';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { Prose } from 'components/Prose';

import { LINKS } from './config';
import Loading from './loading';
import { BaseLayer } from './types';
import { useMapSettings } from './useMapSettings';

const ArcGISMap = dynamic(() => import('./ArcGIS'), {
  ssr: false,
  loading: Loading
});

type Props = {
  baseLayers: BaseLayer[];
};

export default function DeforestationMap({ baseLayers }: Props) {
  const settings = useMapSettings();
  const [isBoxVisible, setBoxVisible] = useState(true);

  return (
    <div className="flex h-fit w-full flex-wrap justify-between gap-4">
      <ArcGISMap
        initial={settings.initial}
        showTreeLoss={settings.showTreeLoss}
        showTreeGain={settings.showTreeGain}
        baseLayers={baseLayers}
        handleCenterPointChange={settings.handleCenterPointChange}
      />
      <div className="relative h-fit max-h-[600px] w-fit max-w-xl overflow-auto rounded-md bg-white bg-opacity-80 backdrop-saturate-50 dark:bg-black dark:bg-opacity-80">
        {isBoxVisible ? (
          <div className="bg-white p-8 pt-10 dark:bg-transparent">
            <button
              onClick={() => setBoxVisible(false)}
              className="absolute left-0 top-0 p-4"
            >
              <Icon
                icon="minus"
                className="h-6 w-6 text-black dark:text-white"
              />
            </button>
            <Heading>Forest Watch</Heading>
            <Prose>
              Keep track of forests in your area. Get a detailed view of changes
              in tree cover over time.
              <br />
              <ul>
                {LINKS.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href}>{link.title}</Link>
                  </li>
                ))}
              </ul>
              <small>
                Tree cover loss and gain data is based on satellite imagery from
                2017 to 2022. Build with GeoData from Global Forest Watch and
                ArcGIS.
              </small>
            </Prose>
          </div>
        ) : (
          <button onClick={() => setBoxVisible(true)} className="relative p-4">
            <Icon icon="plus" className="h-6 w-6 text-black dark:text-white" />
          </button>
        )}
      </div>
      <div
        className={`${
          isBoxVisible ? 'hidden' : 'flex'
        } h-fit w-fit flex-col flex-wrap gap-4 rounded-md bg-white bg-opacity-80 p-4 text-sm backdrop-saturate-50 md:flex dark:bg-black dark:bg-opacity-80`}
      >
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
