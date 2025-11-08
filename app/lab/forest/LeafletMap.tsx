'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

type LeafletMapProps = {
  showTreeLoss: boolean;
  showTreeGain: boolean;
  initial: Initial;
  active?: BaseLayer;
  handleCenterPointChange: (centerPoint: CenterPoint) => void;
};

// Component to handle WMTS layers
function WMTSLayer({ url, layerId }: { url: string; layerId: string }) {
  const map = useMap();

  useEffect(() => {
    if (!url || !layerId) return;

    // Parse the WMTS capabilities URL to create tile layer
    // For ArcGIS WMTS, the URL pattern is typically:
    // {url}/tile/{TileMatrix}/{TileRow}/{TileCol}
    const wmtsLayer = L.tileLayer(
      `${url}/tile/{z}/{y}/{x}`,
      {
        attribution: 'ArcGIS World Imagery',
        maxZoom: 19,
        minZoom: 3
      }
    );

    wmtsLayer.addTo(map);

    return () => {
      wmtsLayer.remove();
    };
  }, [map, url, layerId]);

  return null;
}

// Component to handle base layers (satellite imagery)
function BaseLayerComponent({ active }: { active?: BaseLayer }) {
  const map = useMap();

  useEffect(() => {
    // Remove all existing tile layers except our data layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        const url = (layer as any)._url;
        if (url && !url.includes('globalforestwatch.org')) {
          layer.remove();
        }
      }
    });

    if (active?.url && active?.id) {
      // Add WMTS layer for historical imagery
      // Convert WMTS placeholders to Leaflet format
      let tileUrl = active.url;

      // Handle different WMTS placeholder formats
      tileUrl = tileUrl
        .replace('{level}', '{z}')
        .replace('{col}', '{x}')
        .replace('{row}', '{y}')
        .replace('{TileMatrix}', '{z}')
        .replace('{TileCol}', '{x}')
        .replace('{TileRow}', '{y}');

      const wmtsLayer = L.tileLayer(tileUrl, {
        attribution: 'World Imagery Wayback',
        maxZoom: 19,
        minZoom: 3
      });
      wmtsLayer.addTo(map);
      wmtsLayer.bringToBack();
    } else {
      // Add default satellite imagery from ESRI
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 19,
          minZoom: 3
        }
      );
      satelliteLayer.addTo(map);
      satelliteLayer.bringToBack();
    }
  }, [map, active?.url, active?.id]);

  return null;
}

// Component to handle locate functionality
function LocateControl() {
  const map = useMap();

  useEffect(() => {
    const LocateButton = L.Control.extend({
      onAdd: function () {
        const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom locate-button');
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
          </svg>
        `;
        btn.style.backgroundColor = 'white';
        btn.style.width = '34px';
        btn.style.height = '34px';
        btn.style.cursor = 'pointer';
        btn.style.border = '2px solid rgba(0,0,0,0.2)';
        btn.style.borderRadius = '4px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.padding = '0';
        btn.style.transition = 'all 0.2s ease';
        btn.title = 'Find my location';

        btn.onmouseover = function() {
          btn.style.backgroundColor = '#f8f8f8';
          btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        };

        btn.onmouseout = function() {
          btn.style.backgroundColor = 'white';
          btn.style.boxShadow = 'none';
        };

        btn.onclick = function () {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
              map.flyTo([position.coords.latitude, position.coords.longitude], 15);
            });
          }
        };

        return btn;
      }
    });

    const locateControl = new LocateButton({ position: 'bottomright' });
    locateControl.addTo(map);

    return () => {
      locateControl.remove();
    };
  }, [map]);

  return null;
}

// Component to handle map events
function MapEventHandler({
  handleCenterPointChange,
  initial
}: {
  handleCenterPointChange: (centerPoint: CenterPoint) => void;
  initial: Initial;
}) {
  const debouncedHandler = useDebounce(() => {
    const center = map.getCenter();
    const zoom = map.getZoom();

    handleCenterPointChange({
      latitude: center.lat,
      longitude: center.lng,
      zoom: zoom
    });
  }, 1300);

  const map = useMapEvents({
    moveend: () => {
      debouncedHandler();
    }
  });

  // Handle programmatic navigation when initial position changes
  useEffect(() => {
    map.flyTo([initial.latitude, initial.longitude], initial.zoom, {
      animate: true,
      duration: 1
    });
  }, [initial.latitude, initial.longitude, initial.zoom, map]);

  return null;
}

const LeafletMap = ({ showTreeLoss, showTreeGain, initial, active, handleCenterPointChange }: LeafletMapProps) => {
  const startYear = parseInt(CONFIG.endYear) - parseInt(initial.yearsBack);
  const treeLossLayerRef = useRef<L.TileLayer | null>(null);
  const treeGainLayerRef = useRef<L.TileLayer | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Update tree loss layer visibility
  useEffect(() => {
    if (map && treeLossLayerRef.current) {
      if (showTreeLoss) {
        treeLossLayerRef.current.addTo(map);
      } else {
        treeLossLayerRef.current.remove();
      }
    }
  }, [map, showTreeLoss]);

  // Update tree gain layer visibility
  useEffect(() => {
    if (map && treeGainLayerRef.current) {
      if (showTreeGain) {
        treeGainLayerRef.current.addTo(map);
      } else {
        treeGainLayerRef.current.remove();
      }
    }
  }, [map, showTreeGain]);

  // Initialize layers when map is ready
  useEffect(() => {
    if (!map) return;

    // Create tree loss layer
    treeLossLayerRef.current = L.tileLayer(
      `https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{z}/{x}/{y}.png?start_year=${startYear}&end_year=${CONFIG.endYear}`,
      {
        attribution: 'Global Forest Watch',
        opacity: 0.5,
        maxZoom: 19,
        minZoom: 3
      }
    );

    // Create tree gain layer
    treeGainLayerRef.current = L.tileLayer(
      `https://tiles.globalforestwatch.org/umd_tree_cover_gain_from_height/latest/dynamic/{z}/{x}/{y}.png?start_year=${startYear}&end_year=${CONFIG.endYear}`,
      {
        attribution: 'Global Forest Watch',
        opacity: 0.5,
        maxZoom: 19,
        minZoom: 3
      }
    );

    // Add layers based on initial visibility
    if (initial.showTreeLoss) {
      treeLossLayerRef.current.addTo(map);
    }
    if (initial.showTreeGain) {
      treeGainLayerRef.current.addTo(map);
    }

    return () => {
      treeLossLayerRef.current?.remove();
      treeGainLayerRef.current?.remove();
    };
  }, [map, startYear, initial.showTreeLoss, initial.showTreeGain]);

  return (
    <MapContainer
      center={[initial.latitude, initial.longitude]}
      zoom={initial.zoom}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
      zoomControl={false}
      minZoom={3}
      maxZoom={19}
      ref={setMap}
    >
      <BaseLayerComponent active={active} />
      <LocateControl />
      <MapEventHandler
        handleCenterPointChange={handleCenterPointChange}
        initial={initial}
      />
    </MapContainer>
  );
};

export default LeafletMap;
