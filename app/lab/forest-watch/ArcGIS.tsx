'use client';

import { useEffect, useRef } from 'react';
import Basemap from '@arcgis/core/Basemap';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { useDebounce } from 'hooks/useDebounce';

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

const ArcGISMap = ({ showTreeLoss, showTreeGain, initial, active, handleCenterPointChange }: ArcGISMapProps) => {
  const startYear = parseInt(CONFIG.endYear) - parseInt(initial.yearsBack);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const mapViewRef = useRef<MapView>(null);

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

    // Configure mouse wheel zoom using actionMap
    if (mapViewRef.current.navigation) {
      mapViewRef.current.navigation.actionMap = {
        mouseWheel: 'zoom'
      };
    }

    // Add locate button using HTML element approach (web component alternative)
    const locateBtn = document.createElement('div');
    locateBtn.className = 'esri-widget--button esri-widget esri-interactive';
    locateBtn.title = 'Find my location';
    locateBtn.innerHTML = '<span class="esri-icon-locate"></span>';
    locateBtn.addEventListener('click', () => {
      if (mapViewRef.current && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (mapViewRef.current) {
            mapViewRef.current.goTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15
            });
          }
        });
      }
    });
    mapViewRef.current.ui.add(locateBtn, 'bottom-right');

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

  const debouncedHandler = useDebounce(() => {
    if (!mapViewRef.current) return;

    const { center, zoom } = mapViewRef.current;

    handleCenterPointChange({
      latitude: center?.latitude ?? initial.latitude,
      longitude: center?.longitude ?? initial.longitude,
      zoom: zoom ?? initial.zoom
    });
  }, 1300);

  useEffect(() => {
    if (!mapViewRef.current) return;

    const handle = reactiveUtils.watch(
      () => mapViewRef.current?.stationary,
      (stationary) => {
        if (!mapViewRef.current || !stationary) return;
        debouncedHandler();
      }
    );

    return () => {
      handle?.remove();
    };
  }, [debouncedHandler]);

  useEffect(() => {
    if (!mapViewRef.current) return;

    // Wait for the view to be ready before navigating
    mapViewRef.current
      .when()
      .then(() => {
        if (!mapViewRef.current) return;
        return mapViewRef.current.goTo(
          {
            center: [initial.longitude, initial.latitude],
            zoom: initial.zoom
          },
          { animate: true, duration: 1000 }
        );
      })
      .catch((error) => {
        // Ignore errors if view is destroyed or not ready
        if (error.name !== 'AbortError') {
          console.error('Error navigating map:', error);
        }
      });
  }, [initial.latitude, initial.longitude, initial.zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!active?.id || !active?.url) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
