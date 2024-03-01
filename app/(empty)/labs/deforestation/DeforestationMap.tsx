'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';

import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

import { LoadingMap } from './LoadingMap';
import { useUpdateParams } from './useUpdateParams';

const ArcGISMap = dynamic(() => import('./ArcGIS'), {
  ssr: false,
  loading: LoadingMap
});

export default function DeforestationMap() {
  const { searchParams, updateParams } = useUpdateParams();

  const initial = useRef({
    latitude: parseFloat(searchParams.get('latitude') || '51.96796868185138'),
    longitude: parseFloat(searchParams.get('longitude') || '5.153498231085372'),
    zoom: parseFloat(searchParams.get('zoom') || '17'),
    showTreeloss: searchParams.get('treeloss') === 'on'
  });

  const showTreeloss = searchParams.get('treeloss') === 'on';

  const handleCenterPointChange = (centerPoint: {
    latitude: number;
    longitude: number;
    zoom: number;
  }) => {
    updateParams({
      latitude: centerPoint.latitude.toString(),
      longitude: centerPoint.longitude.toString(),
      zoom: centerPoint.zoom.toString()
    });
  };

  const toggleTreeLossLayer = () => {
    updateParams({ treeloss: showTreeloss ? 'off' : 'on' });
  };

  return (
    <>
      <div className="z-20 w-fit rounded-md bg-white bg-opacity-80 p-8 backdrop-saturate-50 dark:bg-black dark:bg-opacity-80">
        <Heading>Deforestation Check</Heading>
        <Prose>
          Keep track of deforestation in your area. Get a detailed view of
          changes in forest cover over time.
        </Prose>

        <button onClick={toggleTreeLossLayer}>
          Tree loss {showTreeloss ? 'on' : 'off'}
        </button>
      </div>
      <ArcGISMap
        initial={initial.current}
        showTreeLoss={showTreeloss}
        handleCenterPointChange={handleCenterPointChange}
      />
    </>
  );
}
