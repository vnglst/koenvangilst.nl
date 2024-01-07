import { Suspense } from 'react';
import { unstable_noStore } from 'next/cache';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { getLastReading } from 'services/aranet';

export const metadata = {
  title: 'CO2 readings in my office',
  description: 'Readings of the CO2 sensor in my office.'
};

export default async function AllLinks() {
  return (
    <Container centered>
      <Heading level={1} centered>
        CO2 levels
      </Heading>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
        This is a dashboard of the CO2 sensor in my office. It shows the latest
        readings of the CO2 sensor, temperature, humidity and pressure. The
        sensor is a{' '}
        <a
          href="https://aranet4.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Aranet4
        </a>{' '}
        and my{' '}
        <a
          href="https://www.raspberrypi.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Raspberry Pi
        </a>{' '}
        is reading the data on a 5 minute interval via Bluetooth.
      </p>
      <Suspense fallback={<div className="min-h-[600px] w-full" />}>
        <Readings />
      </Suspense>
    </Container>
  );
}
async function Readings() {
  unstable_noStore();
  const reading = await getLastReading();
  const timezoneOffset = new Date().getTimezoneOffset() * 60;
  const timestamp = new Date(
    reading.timestamp * 1000 + timezoneOffset
  ).toLocaleTimeString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-[600px] w-full">
      <pre className="mb-6 w-full text-center text-gray-600 dark:text-gray-400">
        {timestamp}
      </pre>
      <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard header="CO2" metric={reading.co2} unit="ppm" />
        <MetricCard
          header="Temperature"
          metric={reading.temperature}
          unit="°C"
        />
        <MetricCard header="Humidity" metric={reading.humidity} unit="%" />
        <MetricCard header="Pressure" metric={reading.pressure} unit="hPa" />
      </div>
    </div>
  );
}

// TODO: make re-usable and move to components
function MetricCard({ header, metric, unit }) {
  return (
    <div className="min-h-[102px] w-full rounded-lg border border-dashed border-gray-400 bg-white p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center">{header}</div>
      <p className="spacing-sm mt-2 text-3xl font-bold text-black dark:text-white">
        {metric > 0 ? metric.toLocaleString() + ' ' + unit : '-'}
      </p>
    </div>
  );
}
