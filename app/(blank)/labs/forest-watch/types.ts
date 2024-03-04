export type CenterPoint = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type WaybackItem = {
  itemID: string;
  itemTitle: string;
  itemURL: string;
  metadataLayerItemID: string;
  metadataLayerUrl: string;
  layerIdentifier: string;
};

export type WaybackConfig = {
  [key: string]: WaybackItem;
};

export type BaseLayer = {
  releaseNumber: number;
  id: string;
  url: string;
  date: Date;
  position: string;
  isChanged?: boolean;
};
