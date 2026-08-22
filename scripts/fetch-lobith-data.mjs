import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const endpoint = 'https://ddapi20-waterwebservices.rijkswaterstaat.nl/ONLINEWAARNEMINGENSERVICES/OphalenWaarnemingen';
const location = 'lobith.bovenrijn.tolkamer';
const startYear = 1901;
const now = new Date();
const endYear = now.getFullYear();
const outputPath = resolve('content/rhine-at-lobith/lobith-daily.json');

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function requestObservations(year, aquoMetadata, attempt = 1) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Locatie: { Code: location },
      AquoPlusWaarnemingMetadata: { AquoMetadata: aquoMetadata },
      Periode: {
        Begindatumtijd: `${year}-01-01T00:00:00.000+01:00`,
        Einddatumtijd: `${year + 1}-01-01T00:00:00.000+01:00`
      }
    })
  });

  if (response.status === 204) return [];
  if (!response.ok) {
    if (attempt < 4) {
      await sleep(500 * 2 ** attempt);
      return requestObservations(year, aquoMetadata, attempt + 1);
    }
    throw new Error(`Rijkswaterstaat returned ${response.status} for ${year}`);
  }

  const payload = await response.json();
  return payload.WaarnemingenLijst ?? [];
}

function dailyMeans(series) {
  const days = new Map();

  for (const observationSeries of series) {
    for (const observation of observationSeries.MetingenLijst ?? []) {
      const value = observation.Meetwaarde?.Waarde_Numeriek;
      const qualityCode = observation.WaarnemingMetadata?.Kwaliteitswaardecode;
      if (!Number.isFinite(value) || qualityCode === '99' || value <= -999_000_000) continue;

      const date = observation.Tijdstip.slice(0, 10);
      const current = days.get(date) ?? { total: 0, count: 0 };
      current.total += value;
      current.count += 1;
      days.set(date, current);
    }
  }

  return new Map([...days].map(([date, values]) => [date, Math.round(values.total / values.count)]));
}

async function fetchYear(year) {
  const waterLevelPromise = requestObservations(year, {
    Eenheid: { Code: 'cm' },
    Grootheid: { Code: 'WATHTE' },
    Hoedanigheid: { Code: 'NAP' },
    ProcesType: 'meting'
  });

  let dischargeSeries = await requestObservations(year, {
    Eenheid: { Code: 'm3/s' },
    Grootheid: { Code: 'Q' },
    ProcesType: 'meting',
    WaardeBewerkingsMethode: { Code: 'GEM24H' }
  });

  if (dailyMeans(dischargeSeries).size < (year === endYear ? 1 : 360)) {
    dischargeSeries = await requestObservations(year, {
      Eenheid: { Code: 'm3/s' },
      Grootheid: { Code: 'Q' },
      ProcesType: 'meting'
    });
  }

  const [waterLevelSeries] = await Promise.all([waterLevelPromise]);
  const discharge = dailyMeans(dischargeSeries);
  const waterLevel = dailyMeans(waterLevelSeries);
  const values = [];

  for (let day = new Date(Date.UTC(year, 0, 1)); day.getUTCFullYear() === year; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    values.push(discharge.get(date) ?? null, waterLevel.get(date) ?? null);
  }

  console.log(`${year}: ${discharge.size} discharge days, ${waterLevel.size} water-level days`);
  return { year, values };
}

async function main() {
  const years = [];
  for (let year = startYear; year <= endYear; year += 1) years.push(year);

  const results = [];
  for (let index = 0; index < years.length; index += 3) {
    results.push(...(await Promise.all(years.slice(index, index + 3).map(fetchYear))));
  }

  const missing = results.flatMap(({ year, values }) => {
    const dischargeDays = values.filter((value, index) => index % 2 === 0 && value !== null).length;
    const waterLevelDays = values.filter((value, index) => index % 2 === 1 && value !== null).length;
    const expectedDays = year === endYear ? Math.floor((now - new Date(year, 0, 1)) / 86_400_000) + 1 : 360;
    return dischargeDays < expectedDays || waterLevelDays < expectedDays
      ? [{ year, dischargeDays, waterLevelDays }]
      : [];
  });

  const currentYear = results.find(({ year }) => year === endYear);
  let latestDayIndex = -1;
  for (let index = 0; index < (currentYear?.values.length ?? 0); index += 2) {
    if (currentYear.values[index] !== null || currentYear.values[index + 1] !== null) latestDayIndex = index / 2;
  }
  const latestDate = new Date(Date.UTC(endYear, 0, latestDayIndex + 1)).toISOString().slice(0, 10);

  const output = {
    source: 'Rijkswaterstaat WaterWebservices',
    location,
    period: [startYear, endYear],
    updatedThrough: latestDate,
    units: ['m3/s', 'cm NAP'],
    columns: ['discharge', 'waterLevel'],
    missing,
    years: results.sort((a, b) => a.year - b.year)
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output)}\n`);
  console.log(`Wrote ${outputPath}`);
}

await main();
