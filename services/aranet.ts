export type Co2Reading = {
  timestamp: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressure: number;
};

export async function getLastReading() {
  // Service disabled, see git history for implementation
  return null;
}
