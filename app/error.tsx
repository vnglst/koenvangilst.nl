'use client';
import { useEffect } from 'react';
import Link from 'next/link';

import { Body } from 'components/Body';
import { Container } from 'components/Container';
import { Footer } from 'components/Footer';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { Main } from 'components/Main';
import { Nav } from 'components/Nav';
import { Prose } from 'components/Prose';

type ErrorProps = {
  error: Error & { digest?: string };
};

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Body>
      <Nav />
      <Main>
        <Container centered>
          <Prose>
            <Heading level={1}>Something went wrong!</Heading>
            <p>
              You've run into an error. Have you tried turning it off and on?
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
