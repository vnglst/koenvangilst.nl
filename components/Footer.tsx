import Link from 'next/link';

import ExternalLink from './ExternalLink';

export function Footer() {
  return (
    <footer className="mb-12 flex flex-col justify-center px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-start justify-center">
        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 pb-16 sm:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-500 hover:text-gray-600">
              Home
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-600">
              About
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-600"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              href="/snippets"
              className="text-gray-500 hover:text-gray-600"
            >
              Snippets
            </Link>
            <Link
              href="/blog/collection-of-great-tweets"
              className="text-gray-500 hover:text-gray-600"
            >
              Quotes
            </Link>
            <Link href="/credits" className="text-gray-500 hover:text-gray-600">
              Credits
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <ExternalLink href="https://twitter.com/vnglst">
              Twitter
            </ExternalLink>
            <ExternalLink href="https://github.com/vnglst">GitHub</ExternalLink>
            <ExternalLink href="https://www.linkedin.com/in/vangilst/">
              LinkedIn
            </ExternalLink>
          </div>

          <div className="flex flex-col space-y-4">
            <ExternalLink rel="me" href="https://hachyderm.io/@vnglst">
              Mastodon
            </ExternalLink>
          </div>
        </div>
      </div>
      <span className="my-4 text-right text-xs text-gray-500">
        v. {process.env.APP_VERSION} |{' '}
        <a
          className="underline"
          href={`https://github.com/vnglst/koenvangilst.nl/tree/${process.env.COMMIT_HASH}`}
        >
          {process.env.COMMIT_HASH}
        </a>
      </span>
    </footer>
  );
}
