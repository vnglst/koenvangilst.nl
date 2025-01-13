'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Checkbox } from 'components/Checkbox';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { Prose } from 'components/Prose';
import { cx } from 'lib/clsx';

import { CONFIG, LINKS } from './config';
import { getUniqueLayers } from './getUniqueLayers';
import Loading from './loading';
import { BaseLayer, CenterPoint } from './types';
import { useMapSettings } from './useMapSettings';
import { formatDate, generateYears } from './utils';

const ArcGISMap = dynamic(() => import('./ArcGIS'), {
  ssr: false,
  loading: Loading
});

type Props = {
  baseLayers: BaseLayer[];
};

export function ForestTrack({ baseLayers }: Props) {
  const settings = useMapSettings();
  const [isBoxVisible, setBoxVisible] = useState(true);
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>();
  const [layers, setLayers] = useState<BaseLayer[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWayback, setShowWayback] = useState(false);

  const years = generateYears(parseInt(CONFIG.yearsBack));
  const activeLayer = activeLayerIdx !== undefined ? layers[activeLayerIdx] : undefined;

  async function handleCenterPointchange(newCenterPoint: CenterPoint) {
    settings.handleCenterPointChange(newCenterPoint);
    if (!showWayback) return;
    await updateLayers(newCenterPoint);
  }

  async function handleToggleWayback() {
    if (showWayback) {
      setShowWayback(false);
      setActiveLayerIdx(undefined);
    } else {
      setShowWayback(true);
      await updateLayers(settings.centerPoint);
    }
  }

  async function updateLayers(centerPoint: CenterPoint) {
    setIsLoading(true);
    setHasError(false);
    try {
      const uniqueLayers = await getUniqueLayers(centerPoint, baseLayers);
      setLayers(uniqueLayers);
      if (activeLayerIdx === undefined) setActiveLayerIdx(0);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-wrap justify-between gap-4">
      <ArcGISMap
        initial={settings.initial}
        showTreeLoss={settings.showTreeLoss}
        showTreeGain={settings.showTreeGain}
        active={activeLayer}
        handleCenterPointChange={handleCenterPointchange}
      />
      <div className="relative h-fit max-h-[600px] w-fit max-w-xl overflow-auto rounded-md bg-white bg-opacity-80 backdrop-saturate-50 dark:bg-black dark:bg-opacity-80">
        {isBoxVisible ? (
          <div className="bg-white p-8 pt-10 dark:bg-transparent">
            <button onClick={() => setBoxVisible(false)} className="absolute left-0 top-0 p-4">
              <Icon icon="minus" className="h-6 w-6 text-black dark:text-white" />
            </button>
            <Heading>Forest Track</Heading>
            <Prose>
              Keep track of forests in your area. Get a detailed view of changes in tree cover over time.
              <br />
              <ul>
                {LINKS.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} scroll={false}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <small>
                Tree cover loss and gain data is based on satellite imagery from{' '}
                {parseInt(CONFIG.endYear) - parseInt(CONFIG.yearsBack)} to {CONFIG.endYear}. Build with geo data from{' '}
                <a target="_blank" href="https://www.globalforestwatch.org/">
                  Global Forest Watch
                </a>{' '}
                and <a href="https://www.arcgis.com/">ArcGIS</a>.
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
        } flex h-fit w-fit flex-col flex-wrap gap-4 rounded-md bg-black bg-opacity-70 p-4 text-sm text-white backdrop-saturate-50 md:flex`}
      >
        <Checkbox color="pink" onChange={settings.toggleTreeLossLayer} checked={settings.showTreeLoss}>
          Tree loss
        </Checkbox>
        <Checkbox color="blue" onChange={settings.toggleTreeGainLayer} checked={settings.showTreeGain}>
          Tree gain
        </Checkbox>
        <Checkbox color="primary-bright" onChange={handleToggleWayback} checked={showWayback}>
          History
        </Checkbox>
      </div>

      {showWayback ? (
        <div className={`${isBoxVisible ? 'hidden' : 'flex'} mt-auto w-full justify-center md:flex`}>
          <div className="flex w-full max-w-4xl flex-col gap-2 rounded-xl bg-black bg-opacity-70 p-4 backdrop-saturate-50">
            <div className="flex justify-between p-2 text-white">
              {formatDate(activeLayer?.date) || '\u00A0'}
              {isLoading && <span className="ping">Loading...</span>}
              {hasError && <span className="text-red-500">Error loading layers</span>}
            </div>
            <div className="relative mb-5 h-3.5 w-full rounded-full bg-gray-800 p-0">
              <div className="absolute left-5 right-5 hidden justify-between md:flex">
                {years.map((year) => (
                  <div key={year}>
                    <div className="relative mx-auto h-3.5 w-0.5 border-l border-gray-400"></div>
                    <div className="pt-2 text-sm text-gray-400">{year}</div>
                  </div>
                ))}
              </div>
              <ul className="absolute left-0 top-0 m-0 flex w-full list-none p-0">
                {layers.map((layer, idx) => {
                  const isActive = activeLayer?.releaseNumber === layer.releaseNumber;
                  const classes = cx(
                    'absolute h-3.5 w-3.5 cursor-pointer rounded-full transition-all duration-200 ease-in-out bg-opacity-10',
                    isActive ? 'scale-150 bg-primary-bright bg-opacity-100' : 'bg-primary bg-opacity-100'
                  );

                  return (
                    <li key={layer.releaseNumber} style={{ left: layer.position }} className={classes}>
                      <input
                        type="checkbox"
                        title={formatDate(layer.date)}
                        className="cursor-pointer opacity-0"
                        checked={isActive}
                        onChange={() => setActiveLayerIdx(idx === activeLayerIdx ? undefined : idx)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
