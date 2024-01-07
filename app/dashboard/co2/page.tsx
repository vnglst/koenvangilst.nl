import { Suspense } from 'react';
import { unstable_noStore } from 'next/cache';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { getLastReading } from 'services/aranet';

import { Readings } from '../stats/(components)/Readings';

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
      <Readings />
    </Container>
  );
}
