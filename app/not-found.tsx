import Link from 'next/link';

import { Body } from 'components/Body';
import { Container } from 'components/Container';
import { Footer } from 'components/Footer';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { Main } from 'components/Main';
import { Nav } from 'components/Nav';
import { Prose } from 'components/Prose';

export const metadata = {
  title: '404 – Not found'
};

export default function NotFound() {
  return (
    <Body>
      <Nav />
      <Main>
        <Container centered>
          <Prose>
            <Heading level={1}>404 - Not found</Heading>
            <p>
              It seems you've found something that used to exist, or you spelled
              something wrong. I'm guessing you spelled something wrong. Can you
              double-check that URL?
            </p>
            <Link
              href="/"
              className="align-center flex w-fit text-gray-600 no-underline transition-all hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Return Home
              <Icon icon="arrow-right" className="ml-1 h-6 w-6" />
            </Link>
          </Prose>
        </Container>
      </Main>
      <Footer />
    </Body>
  );
}
