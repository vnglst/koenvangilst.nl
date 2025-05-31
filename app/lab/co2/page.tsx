import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

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
          This dashboard shows the latest readings of the CO2 sensor in my office. I'm using a{' '}
          <Link href="https://aranet4.com/">Aranet4</Link> and my{' '}
          <Link href="https://www.raspberrypi.org/">Raspberry Pi</Link> is reading the data on a 1 minute interval via
          Bluetooth. I also wrote a <Link href="/blog/aranet4-co2-monitor">blog post</Link> about it. Should the levels
          rise above the recommended threshold of 1000 ppm, don't hesitate to reach out to me on{' '}
          <Link href="https://elk.zone/hachyderm.io/@vnglst">Mastodon</Link> to remind me to ventilate!
        </p>
      </Prose>
      <Co2Monitor />
    </Container>
  );
}
