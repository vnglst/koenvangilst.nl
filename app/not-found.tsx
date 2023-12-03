import Link from 'next/link';

import { Article } from 'ui/Article';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';

export const metadata = {
  title: '404 – Not found'
};

export default function NotFound() {
  return (
    <Container centered>
      <Article>
        <Heading level={1}>404 - Not found</Heading>
        <p>
          It seems you've found something that used to exist, or you spelled
          something wrong. I'm guessing you spelled something wrong. Can you
          double-check that URL?
        </p>
        <Link
          href="/"
          className="rounded-md text-center font-bold text-black dark:text-white"
        >
          Return Home
        </Link>
      </Article>
    </Container>
  );
}
