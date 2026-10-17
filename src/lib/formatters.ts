function unitFormatter(unit: string, options: Intl.NumberFormatOptions) {
  return (value?: number | null) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value.toLocaleString('en-GB', options)} ${unit}`;
  };
}

export const temperatureFormatter = unitFormatter('°C', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: 'always'
});

export const mmFormatter = unitFormatter('mm', {
  maximumFractionDigits: 0,
  signDisplay: 'auto'
});

export const hoursFormatter = unitFormatter('hours', {
  maximumFractionDigits: 0,
  signDisplay: 'always'
});

export const dateFormatter = (value: string) => {
  return new Date(value).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
