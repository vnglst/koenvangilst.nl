'use client';

import { useEffect, useRef } from 'react';
import Basemap from '@arcgis/core/Basemap';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Locate from '@arcgis/core/widgets/Locate';
import { debounce } from 'lodash';

import { CONFIG } from './config';
import { BaseLayer, CenterPoint } from './types';

type Initial = {
  latitude: number;
  longitude: number;
  zoom: number;
  showTreeLoss: boolean;
  showTreeGain: boolean;
  yearsBack: string;
};

type ArcGISMapProps = {
  showTreeLoss: boolean;
  showTreeGain: boolean;
  initial: Initial;
  active?: BaseLayer;
  handleCenterPointChange: (centerPoint: CenterPoint) => void;
};

const ArcGISMap = ({
  showTreeLoss,
  showTreeGain,
  initial,
  active,
  handleCenterPointChange
}: ArcGISMapProps) => {
  const startYear = parseInt(CONFIG.endYear) - parseInt(initial.yearsBack);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const mapViewRef = useRef<MapView>();

  useEffect(() => {
    if (!containerRef.current) return;

    const treeLossLayer = new WebTileLayer({
      urlTemplate: `https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{level}/{col}/{row}.png?start_year=${startYear}&end_year=${CONFIG.endYear}`,
      copyright: 'Global forest watch',
      opacity: 0.5,
      id: 'tree_loss',
      title: 'Tree cover loss',
      visible: initial.showTreeLoss
    });

    const treeGainLayer = new WebTileLayer({
      urlTemplate: `https://tiles.globalforestwatch.org/umd_tree_cover_gain_from_height/latest/dynamic/{level}/{col}/{row}.png?start_year=${startYear}&end_year=${CONFIG.endYear}`,
      opacity: 0.5,
      id: 'tree_gain',
      title: 'Tree cover gain',
      visible: false
    });

    const basemap = active
      ? new Basemap({
          baseLayers: [
            new WMTSLayer({
              url: active.url,
              activeLayer: {
                id: active.id
              }
            })
          ]
        })
      : 'hybrid';

    mapRef.current = new Map({
      basemap,
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
        /**
         * The MapView's constraints.effectiveLODs will be null if the following statements are true
         * - The map doesn't have a basemap, or
         * - the basemap does not have a TileInfo,
         * - AND the first layer added to the map does not have a TileInfo.
         *
         * If the effectiveLODs are null, it is not possible to set zoom on the MapView because the conversion is not possible.
         * The zoom value will be -1 in this case. Setting scale will work.
         * To address this, the MapView's constraints.lods can be defined at the time of its initialization by calling `TileInfo.create().lods`.
         * @see https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
         */
        lods: TileInfo.create().lods,
        rotationEnabled: false,
        minZoom: 3,
        // The maximum zoom level of wayback tiles is 17, we allow pixelated zooming 2 levels beyond that
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
      const debouncedHandler = debounce(handleCenterPointChange, 1300);

      debouncedHandler({
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

  useEffect(() => {
    if (!mapRef.current) return;

    if (!active?.id || !active?.url) {
      mapRef.current.basemap = 'hybrid' as any;
    } else {
      mapRef.current.basemap = new Basemap({
        baseLayers: [
          new WMTSLayer({
            url: active.url,
            activeLayer: {
              id: active.id
            }
          })
        ]
      });
    }
  }, [active?.id, active?.url]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default ArcGISMap;
