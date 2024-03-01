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

type ArcGISMapProps = {
  showTreeLossLayer: boolean;
  initialCenterPoint: CenterPoint;
  handleCenterPointChange: (centerPoint: CenterPoint) => void;
};

const ArcGISMap = ({
  showTreeLossLayer,
  initialCenterPoint,
  handleCenterPointChange
}: ArcGISMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();

  useEffect(() => {
    if (!containerRef.current) return;

    const treeLossLayer = new WebTileLayer({
      urlTemplate: `https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{level}/{col}/{row}.png?start_year=${startYear}&end_year=${endYear}`,
      copyright: 'Global forest watch',
      opacity: 0.5,
      id: 'tree_loss',
      title: 'Tree cover loss'
    });

    mapRef.current = new Map({
      basemap: 'satellite',
      layers: [treeLossLayer]
    });

    const mapView = new MapView({
      container: containerRef.current,
      extent: {
        xmin: 3.31497114423,
        ymin: 50.803721015,
        xmax: 7.09205325687,
        ymax: 53.5104033474,
        spatialReference: { wkid: 4326 }
      },
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
      view: mapView,
      goToOverride: function (view, options) {
        return view.goTo(options.target);
      }
    });

    mapView.ui.add(locate, 'bottom-left');

    const watcher = mapView.watch('stationary', () => {
      const center = mapView.center;

      if (!center) return;

      handleCenterPointChange({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: mapView.zoom
      });
    });

    mapView.when(() => {
      mapView.goTo(initialCenterPoint, { animate: true });
    });

    return () => {
      // wait until the map is ready before destroying it
      mapView.when(() => {
        watcher.remove();
        mapView.destroy();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.layers.forEach((layer) => {
        if (layer.id === 'tree_loss') {
          layer.visible = showTreeLossLayer;
        }
      });
    }
  }, [showTreeLossLayer]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default ArcGISMap;
