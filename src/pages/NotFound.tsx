import { Helmet } from 'react-helmet-async';

import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 – Not found | Koen van Gilst</title>
      </Helmet>
      <Container>
        <Prose>
          <Heading level={2}>404 - Not found</Heading>
          <p>It seems you've found something that doesn't exist...</p>
          <Link href="/">Return Home</Link>
        </Prose>
      </Container>
    </>
  );
}
