import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdateParams } from 'hooks/useUpdateParams';

import { CONFIG } from './config';
import { CenterPoint } from './types';

/**
 * All application state lives in the URL. This hook is responsible for
 * reading and writing to the URL.
 */
export function useMapSettings() {
  const { searchParams, deleteParam, updateParams } = useUpdateParams();

  const yearsBack = searchParams.get('yearsBack') || CONFIG.yearsBack;
  const showTreeLoss = searchParams.get('treeloss') !== 'off';
  const showTreeGain = searchParams.get('treegain') !== 'off';
  const update = searchParams.get('update') === 'on';

  const currentCenterPoint = useMemo(
    () => ({
      latitude: parseFloat(searchParams.get('latitude') || CONFIG.latitude),
      longitude: parseFloat(searchParams.get('longitude') || CONFIG.longitude),
      zoom: parseFloat(searchParams.get('zoom') || CONFIG.zoom)
    }),
    [searchParams]
  );

  const [initial, setInitial] = useState({
    ...currentCenterPoint,
    showTreeLoss,
    showTreeGain,
    yearsBack
  });

  useEffect(() => {
    if (!update) return;

    setInitial({
      ...currentCenterPoint,
      showTreeLoss,
      showTreeGain,
      yearsBack
    });

    deleteParam('update');
  }, [
    currentCenterPoint,
    deleteParam,
    showTreeGain,
    showTreeLoss,
    update,
    yearsBack
  ]);

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
