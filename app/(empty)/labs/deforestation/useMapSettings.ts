import { useCallback, useRef } from 'react';
import { useUpdateParams } from 'hooks/useUpdateParams';

import { CenterPoint } from './types';

const DEFAULT = {
  latitude: '51.96796868185138',
  longitude: '5.153498231085372',
  zoom: '17'
};

export function useMapSettings() {
  const { searchParams, updateParams } = useUpdateParams();

  const initial = useRef({
    latitude: parseFloat(searchParams.get('latitude') || DEFAULT.latitude),
    longitude: parseFloat(searchParams.get('longitude') || DEFAULT.longitude),
    zoom: parseFloat(searchParams.get('zoom') || DEFAULT.zoom),
    showTreeLoss: searchParams.get('treeloss') === 'on',
    showTreeGain: searchParams.get('treegain') === 'on'
  });

  const showTreeLoss = searchParams.get('treeloss') === 'on';
  const showTreeGain = searchParams.get('treegain') === 'on';

  const handleCenterPointChange = useCallback(
    (centerPoint: CenterPoint) => {
      updateParams({
        latitude: centerPoint.latitude.toString(),
        longitude: centerPoint.longitude.toString(),
        zoom: centerPoint.zoom.toString()
      });
    },
    [updateParams]
  );

  const toggleTreeLossLayer = useCallback(() => {
    updateParams({ treeloss: showTreeLoss ? 'off' : 'on' });
  }, [showTreeLoss, updateParams]);

  const toggleTreeGainLayer = useCallback(() => {
    updateParams({ treegain: showTreeGain ? 'off' : 'on' });
  }, [showTreeGain, updateParams]);

  return {
    initial,
    showTreeLoss,
    showTreeGain,
    handleCenterPointChange,
    toggleTreeLossLayer,
    toggleTreeGainLayer
  };
}
