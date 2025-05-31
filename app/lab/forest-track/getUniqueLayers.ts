import { BaseLayer, CenterPoint } from './types';

const MAX_ZOOM_LEVEL_TILES = 17;

/**
 * Loops through the base layers and checks every layer if the tiles are diffent
 * from the previous layer. If the tiles are different, the release number is
 * added to the final results.
 *
 * The final result is a list of release numbers that are unique for the given
 * center point.
 */
export async function getUniqueLayers(
  pointInfo: CenterPoint,
  baseLayers: BaseLayer[]
) {
  const level = Math.min(Math.round(pointInfo.zoom), MAX_ZOOM_LEVEL_TILES);
  const column = long2tile(pointInfo.longitude, level);
  const row = lat2tile(pointInfo.latitude, level);

  const candidates = baseLayers.map((layer) => {
    return {
      releaseNumber: layer.releaseNumber,
      url: getTileImageUrl({
        column,
        row,
        level,
        urlTemplate: layer.url
      })
    };
  });

  const uniques = await removeDuplicateCandidates(candidates);
  return baseLayers.filter((layer) => uniques.includes(layer.releaseNumber));
}

const long2tile = (lon: number, zoom: number) => {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
};

const lat2tile = (lat: number, zoom: number) => {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
};

function getTileImageUrl({
  column,
  row,
  level,
  urlTemplate
}: {
  column: number;
  row: number;
  level: number;
  urlTemplate: string;
}) {
  return urlTemplate
    .replace('{level}', level.toString())
    .replace('{row}', row.toString())
    .replace('{col}', column.toString());
}

type Candidate = {
  releaseNumber: number;
  url: string;
};

async function removeDuplicateCandidates(candidates: Candidate[]) {
  if (!candidates.length) {
    return [];
  }

  const finalResults: number[] = [];

  const imageDataUriRequests = candidates.map((candidate) =>
    getSampledImagedDataUri(candidate.url, candidate.releaseNumber)
  );

  const imageDataUriResults = await Promise.all(imageDataUriRequests);
  let dataUriPrevRelease = '';

  for (const { dataUri, releaseNumber } of imageDataUriResults) {
    if (dataUri === dataUriPrevRelease) {
      continue;
    }

    finalResults.push(releaseNumber);
    dataUriPrevRelease = dataUri;
  }

  return finalResults;
}

function getSampledImagedDataUri(imageUrl: string, releaseNumber: number) {
  const samplePoints = [512, 1000, 2500, 5000, 7500, 10000, 12500, 15000];

  return fetch(imageUrl)
    .then((response) => {
      if (!response.ok) throw new Error('Network error while fetching imag.');
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      const uInt8Array = new Uint8Array(arrayBuffer);
      let i = uInt8Array.length;
      const binaryString = new Array(i);
      while (i--) {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      }
      const data = binaryString.join('');
      const base64 = window.btoa(data);

      let dataUri = '';
      for (const point of samplePoints) {
        dataUri += base64.substr(point, 500);
      }

      return {
        releaseNumber,
        dataUri
      };
    });
}
