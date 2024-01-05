import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

export default function Page() {
  return (
    <Container>
      <Prose>
        <Heading>Over</Heading>
        <p>
          The year 2100 seems far away but it is not unlikely that my children
          will still be alive then. What will the Netherlands look like then?
          Will we have a warmer, subtropical climate then? Will our dykes be
          high enough? And will our economy be completely CO2 neutral?
        </p>
        <p>
          With this website, I want to answer these questions at a glance. You
          can immediately see where we are now and what the prognosis is for the
          Netherlands in 2100. The graphs are always based on facts and
          scientific models from well-known institutes. Where the data is as up
          to date as possible and the models correspond to the latest insights.
        </p>
        <p>
          I hope that, as octogenarians, my children will be able to look back
          on our period as the tipping point when we started to tackle climate
          change seriously.
        </p>
        <p>
          The source code is open source and can be found on Github. This
          website was created by{' '}
          <Link
            href="https://koenvangilst.nl/about"
            className="underline hover:text-slate-700 dark:hover:text-slate-200"
          >
            Koen van Gilst
          </Link>
          . The source code can be found on{' '}
          <a href="https://github.com/vnglst/koenvangilst.nl" target="_blank">
            Github
          </a>
          . React, TailwindCSS and the visualisation library Apache ECharts were
          used to create this website..
        </p>
      </Prose>
    </Container>
  );
}
