export type GitHub = {
  stars?: number;
  followers?: number;
};

export type Unsplash = {
  downloads?: number;
  views?: number;
};

export type View = {
  created_at: string;
  count: number;
};

export type Co2Reading = {
  timestamp: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressure: number;
};
