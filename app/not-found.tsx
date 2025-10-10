import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

export const metadata = {
  title: '404 – Not found'
};

export default function NotFound() {
  return (
    <Container>
      <Prose>
        <Heading level={2}>404 - Not found</Heading>
        <p>
          It seems you've found something that used to exist, or you spelled something wrong. I'm guessing you spelled
          something wrong. Can you double-check that URL?
        </p>
        <Link href="/">Return Home</Link>
      </Prose>
    </Container>
  );
}
