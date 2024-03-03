import { BaseLayer, WaybackConfig } from './types';

type Init = {
  url: string;
  yearsBack: number;
};

export async function getBaseLayers(init: Init) {
  const response = await fetch(init.url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const waybackConfig = (await response.json()) as WaybackConfig;
  return parse(waybackConfig, init.yearsBack);
}

function parse(waybackConfig: WaybackConfig, yearsBack: number): BaseLayer[] {
  const layers = Object.entries(waybackConfig).map(([releaseNumber, layer]) => {
    const date = extractDateFromWaybackItemTitle(layer.itemTitle);

    return {
      date,
      releaseNumber: Number(releaseNumber),
      id: layer.layerIdentifier,
      url: layer.itemURL,
      title: layer.itemTitle,
      position: calcPosition(date, yearsBack)
    };
  });

  const sorted = layers.sort((a, b) => a.date.getTime() - b.date.getTime());

  const oldestDateToKeep = new Date();
  oldestDateToKeep.setFullYear(oldestDateToKeep.getFullYear() - yearsBack);

  return sorted.filter((layer) => layer.date > oldestDateToKeep);
}

function calcPosition(date, yearsBack) {
  const dateYearsAgo = new Date();
  dateYearsAgo.setFullYear(dateYearsAgo.getFullYear() - yearsBack);
  const diff = date.getTime() - dateYearsAgo.getTime();
  const percentage = diff / (yearsBack * 365 * 24 * 60 * 60 * 1000);
  return `${Math.round(percentage * 100)}%`;
}

function extractDateFromWaybackItemTitle(waybackItemTitle = '') {
  const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
  const results = waybackItemTitle.match(regexpYYYYMMDD);
  const dateString = results?.length ? results[0] : waybackItemTitle;
  return convertDateFromWaybackItemTitle(dateString);
}

function convertDateFromWaybackItemTitle(dateString = '') {
  const dateParts = dateString.split('-');
  const year = +dateParts[0];
  const mon = +dateParts[1] - 1;
  const day = +dateParts[2];
  return new Date(year, mon, day);
}
