'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';

import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

import { useUpdateSearchParams } from './useUpdateSearchParams';

const ArcGISMap = dynamic(() => import('./ArcGIS'), { ssr: false });

export default function Container() {
  const { searchParams, updateParams } = useUpdateSearchParams();

  const handleCenterPointChange = useCallback(
    (centerPoint: { latitude: number; longitude: number; zoom: number }) => {
      updateParams({
        latitude: centerPoint.latitude.toString(),
        longitude: centerPoint.longitude.toString(),
        zoom: centerPoint.zoom.toString()
      });
    },
    [updateParams]
  );

  const treeloss = searchParams.get('treeloss') === 'on';

  const toggleTreeLossLayer = useCallback(() => {
    updateParams({
      treeloss: treeloss ? 'off' : 'on'
    });
  }, [treeloss, updateParams]);

  const latitude = parseFloat(searchParams.get('latitude') || '0');
  const longitude = parseFloat(searchParams.get('longitude') || '0');
  const zoom = parseFloat(searchParams.get('zoom') || '0');

  return (
    <>
      <div className="z-20 w-fit rounded-md bg-white bg-opacity-80 p-4 backdrop-saturate-50 md:px-8 dark:bg-black dark:bg-opacity-50">
        <Heading>Deforestation Tracker</Heading>
        <Prose>
          Keep track of deforestation in your area. Get a detailed view of
          changes in forest cover over time.
        </Prose>

        <button onClick={toggleTreeLossLayer}>
          Tree loss {treeloss ? 'on' : 'off'}
        </button>
      </div>
      <ArcGISMap
        showTreeLossLayer={treeloss}
        initialCenterPoint={{ latitude, longitude, zoom }}
        handleCenterPointChange={handleCenterPointChange}
      />
    </>
  );
}
