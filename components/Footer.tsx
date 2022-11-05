import Link from 'next/link';
import ExternalLink from './ExternalLink';

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center px-8 mb-12">
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto w-full">
        <div className="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-4 mt-8">
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
            <ExternalLink rel="me" href="https://toot.community/@vnglst">
              Mastodon
            </ExternalLink>
          </div>
        </div>
      </div>
      <span className="text-gray-500 text-right text-xs my-4">
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
