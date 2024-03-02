import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdateParams } from 'hooks/useUpdateParams';

import { CenterPoint } from './types';

const DEFAULT = {
  latitude: '51.96796868185138',
  longitude: '5.153498231085372',
  zoom: '17'
};

export function useMapSettings() {
  const { searchParams, deleteParam, updateParams } = useUpdateParams();

  const showTreeLoss = searchParams.get('treeloss') === 'on';
  const showTreeGain = searchParams.get('treegain') === 'on';
  const update = searchParams.get('update') === 'on';

  const currentCenterPoint = useMemo(
    () => ({
      latitude: parseFloat(searchParams.get('latitude') || DEFAULT.latitude),
      longitude: parseFloat(searchParams.get('longitude') || DEFAULT.longitude),
      zoom: parseFloat(searchParams.get('zoom') || DEFAULT.zoom)
    }),
    [searchParams]
  );

  const [initial, setInitial] = useState({
    ...currentCenterPoint,
    showTreeLoss: searchParams.get('treeloss') === 'on',
    showTreeGain: searchParams.get('treegain') === 'on'
  });

  useEffect(() => {
    if (!update) return;

    setInitial({
      ...currentCenterPoint,
      showTreeLoss: searchParams.get('treeloss') === 'on',
      showTreeGain: searchParams.get('treegain') === 'on'
    });

    deleteParam('update');
  }, [update, currentCenterPoint, searchParams, deleteParam]);

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
