'use client';

import { useEffect, useRef } from 'react';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Locate from '@arcgis/core/widgets/Locate';

import { CenterPoint } from './types';

const endYear = 2022;
const startYear = endYear - 5;

type Initial = {
  latitude: number;
  longitude: number;
  zoom: number;
  showTreeLoss: boolean;
  showTreeGain: boolean;
};

type ArcGISMapProps = {
  showTreeLoss: boolean;
  showTreeGain: boolean;
  initial: Initial;
  handleCenterPointChange: (centerPoint: CenterPoint) => void;
};

const ArcGISMap = ({
  showTreeLoss,
  showTreeGain,
  initial,
  handleCenterPointChange
}: ArcGISMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const mapViewRef = useRef<MapView>();

  useEffect(() => {
    if (!containerRef.current) return;

    const treeLossLayer = new WebTileLayer({
      urlTemplate: `https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{level}/{col}/{row}.png?start_year=${startYear}&end_year=${endYear}`,
      copyright: 'Global forest watch',
      opacity: 0.5,
      id: 'tree_loss',
      title: 'Tree cover loss',
      visible: initial.showTreeLoss
    });

    const treeGainLayer = new WebTileLayer({
      urlTemplate: `https://tiles.globalforestwatch.org/umd_tree_cover_gain_from_height/latest/dynamic/{level}/{col}/{row}.png?start_year=${startYear}&end_year=${endYear}`,
      opacity: 0.5,
      id: 'tree_gain',
      title: 'Tree cover gain',
      visible: false
    });

    mapRef.current = new Map({
      basemap: 'hybrid',
      layers: [treeLossLayer, treeGainLayer]
    });

    mapViewRef.current = new MapView({
      container: containerRef.current,
      center: [initial.longitude, initial.latitude],
      zoom: initial.zoom,
      ui: { components: [] },
      navigation: {
        mouseWheelZoomEnabled: true,
        browserTouchPanEnabled: true
      },
      map: mapRef.current,
      constraints: {
        lods: TileInfo.create().lods,
        rotationEnabled: false,
        minZoom: 3,
        maxZoom: 19
      }
    });

    const locate = new Locate({
      view: mapViewRef.current,
      goToOverride: function (view, options) {
        return view.goTo(options.target);
      }
    });

    mapViewRef.current.ui.add(locate, 'bottom-right');

    return () => {
      // wait until the map is ready before destroying it
      mapViewRef.current?.when(() => {
        mapViewRef.current?.destroy();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.layers.forEach((layer) => {
        if (layer.id === 'tree_loss') {
          layer.visible = showTreeLoss;
        }
      });
    }
  }, [showTreeLoss]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.layers.forEach((layer) => {
        if (layer.id === 'tree_gain') {
          layer.visible = showTreeGain;
        }
      });
    }
  }, [showTreeGain]);

  useEffect(() => {
    if (!mapViewRef.current) return;

    const watcher = mapViewRef.current.watch('stationary', (stationary) => {
      if (!mapViewRef.current || !stationary) return;

      handleCenterPointChange({
        latitude: mapViewRef.current.center.latitude,
        longitude: mapViewRef.current.center.longitude,
        zoom: mapViewRef.current.zoom
      });
    });

    return () => {
      watcher?.remove();
    };
  }, [handleCenterPointChange]);

  useEffect(() => {
    if (!mapViewRef.current) return;

    mapViewRef.current.goTo(
      {
        center: [initial.longitude, initial.latitude],
        zoom: initial.zoom
      },
      { animate: true, duration: 1000 }
    );
  }, [initial.latitude, initial.longitude, initial.zoom]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default ArcGISMap;
