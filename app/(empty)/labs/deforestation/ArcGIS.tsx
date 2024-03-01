'use client';

import React, { useEffect, useRef } from 'react';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Locate from '@arcgis/core/widgets/Locate';

const endYear = 2022;
const startYear = endYear - 5;

type CenterPoint = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type Initial = {
  latitude: number;
  longitude: number;
  zoom: number;
  showTreeloss: boolean;
};

type ArcGISMapProps = {
  showTreeLoss: boolean;
  initial: Initial;
  handleCenterPointChange: (centerPoint: CenterPoint) => void;
};

const ArcGISMap = ({
  showTreeLoss,
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
      visible: initial.showTreeloss
    });

    mapRef.current = new Map({
      basemap: 'satellite',
      layers: [treeLossLayer]
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

    mapViewRef.current.ui.add(locate, 'bottom-left');

    return () => {
      // wait until the map is ready before destroying it
      mapViewRef.current?.when(() => {
        mapViewRef.current?.destroy();
      });
    };
  }, [initial]);

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
    let watcher: __esri.WatchHandle | undefined;

    if (mapViewRef.current) {
      watcher = mapViewRef.current.watch('center, zoom', () => {
        handleCenterPointChange({
          latitude: mapViewRef.current!.center.latitude,
          longitude: mapViewRef.current!.center.longitude,
          zoom: mapViewRef.current!.zoom
        });
      });
    }

    return () => {
      watcher?.remove();
    };
  }, [handleCenterPointChange]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default ArcGISMap;
