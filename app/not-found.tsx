import Link from 'next/link';

import { Heading } from 'ui/Heading';

export const metadata = {
  title: '404 – Not found'
};

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-start max-w-2xl m-auto">
      <Heading level={1}>404 - Not found</Heading>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        It seems you've found something that used to exist, or you spelled
        something wrong. I'm guessing you spelled something wrong. Can you
        double-check that URL?
      </p>
      <Link
        href="/"
        className="font-bold text-center rounded-md text-black dark:text-white"
      >
        Return Home
      </Link>
    </div>
  );
}
