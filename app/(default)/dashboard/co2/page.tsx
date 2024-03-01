import Link from 'next/link';

import { Container } from 'components/ContentContainer';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

import { Co2Monitor } from './(components)/Co2Monitor';

export const metadata = {
  title: 'Office CO2 readings',
  description: 'Readings of the CO2 sensor in my office.'
};

export default async function Page() {
  return (
    <Container centered>
      <Heading level={1} centered>
        CO2 levels
      </Heading>
      <Prose>
        <p className="mb-4 text-center">
          This dashboard shows the latest readings of the CO2 sensor in my
          office. I'm using a{' '}
          <a
            href="https://aranet4.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aranet4
          </a>{' '}
          and my{' '}
          <a
            href="https://www.raspberrypi.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Raspberry Pi
          </a>{' '}
          is reading the data on a 1 minute interval via Bluetooth. I also wrote
          a <Link href="/blog/aranet4-co2-monitor">blog post</Link> about it.
          Should the levels rise above the recommended threshold of 1000 ppm,
          don't hesitate to reach out to me on{' '}
          <a href="https://twitter.com/intent/tweet?text=@vnglst%20Open%20a%20window%20now!">
            Twitter
          </a>{' '}
          or <a href="https://elk.zone/hachyderm.io/@vnglst">Mastodon</a> to
          remind me to ventilate!
        </p>
      </Prose>
      <Co2Monitor />
    </Container>
  );
}
