'use client';
import { useEffect } from 'react';

import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

type ErrorProps = {
  error: Error & { digest?: string };
};

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Prose>
        <Heading level={1}>Something went wrong!</Heading>
        <p>You've run into an error. Have you tried turning it off and on?</p>
        <Link href="/">Return Home</Link>
      </Prose>
    </Container>
  );
}
