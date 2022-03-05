import Link from 'next/link';
import ExternalLink from './ExternalLink';

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center px-8 mb-12">
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto w-full">
        <div className="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3 mt-8">
          <div className="flex flex-col space-y-4">
            <Link href="/">
              <a className="text-gray-500 hover:text-gray-600">Home</a>
            </Link>
            <Link href="/about">
              <a className="text-gray-500 hover:text-gray-600">About</a>
            </Link>
            <Link href="/dashboard">
              <a className="text-gray-500 hover:text-gray-600">Dashboard</a>
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <Link href="/snippets">
              <a className="text-gray-500 hover:text-gray-600">Snippets</a>
            </Link>
            <Link href="/blog/collection-of-great-tweets">
              <a className="text-gray-500 hover:text-gray-600">Quotes</a>
            </Link>
            <Link href="/credits">
              <a className="text-gray-500 hover:text-gray-600">Credits</a>
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
