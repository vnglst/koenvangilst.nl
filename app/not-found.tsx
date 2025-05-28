import Link from 'next/link';

import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Icon } from 'components/ui/Icon';

export const metadata = {
  title: '404 – Not found'
};

export default function NotFound() {
  return (
    <Container centered>
      <Prose>
        <Heading level={1}>404 - Not found</Heading>
        <p>
          It seems you've found something that used to exist, or you spelled something wrong. I'm guessing you spelled
          something wrong. Can you double-check that URL?
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
  );
}
