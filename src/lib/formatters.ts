export const temperatureFormatter = (value?: number | null) => {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  return `${value.toLocaleString('en-UK', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'always'
  })} °C`;
};

export const mmFormatter = (value?: number | null) => {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  return `${value.toLocaleString('en-UK', {
    maximumFractionDigits: 0,
    signDisplay: 'auto'
  })} mm`;
};

export const hoursFormatter = (value?: number | null) => {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  return `${value.toLocaleString('en-UK', {
    maximumFractionDigits: 0,
    signDisplay: 'always'
  })} hours`;
};

export const dateFormatter = (value: string) => {
  return new Date(value).toLocaleDateString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
