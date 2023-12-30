export const temperatureFormatter = (value?: number | null) => {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  return `${value.toLocaleString('en-UK', {
    maximumFractionDigits: 2,
    signDisplay: 'always'
  })} °C`;
};

export const dateFormatter = (value: string) => {
  return new Date(value).toLocaleDateString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const dateTimeFormatter = (value: string) => {
  return new Date(value).toLocaleDateString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};
