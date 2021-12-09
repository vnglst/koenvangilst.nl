import Link from 'next/link';

const ExternalLink = ({ href, children }) => (
  <a
    className="text-gray-500 hover:text-gray-600 transition"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
    <svg
      className="h-4 w-4 ml-1 inline"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </a>
);

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center px-8">
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto w-full">
        <div className="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3 mt-8">
          <div className="flex flex-col space-y-4">
            <Link href="/">
              <a className="text-gray-500 hover:text-gray-600 transition">
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className="text-gray-500 hover:text-gray-600 transition">
                About
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="text-gray-500 hover:text-gray-600 transition">
                Dashboard
              </a>
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <Link href="/snippets">
              <a className="text-gray-500 hover:text-gray-600 transition">
                Snippets
              </a>
            </Link>
            <Link href="/blog/collection-of-great-tweets">
              <a className="text-gray-500 hover:text-gray-600 transition">
                Quotes
              </a>
            </Link>
            <Link href="/credits">
              <a className="text-gray-500 hover:text-gray-600 transition">
                Credits
              </a>
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
    </footer>
  );
}
