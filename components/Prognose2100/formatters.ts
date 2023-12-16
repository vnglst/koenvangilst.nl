export const temperatureFormatter = (value: number) =>
  `${value.toLocaleString('en-UK', {
    maximumFractionDigits: 2,
    signDisplay: 'always'
  })} °C`;
