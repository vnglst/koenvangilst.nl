export const temperatureFormatter = (value?: number) => {
  if (value === undefined) {
    return 'N/A';
  }

  return `${value.toLocaleString('en-UK', {
    maximumFractionDigits: 2,
    signDisplay: 'always'
  })} °C`;
};
